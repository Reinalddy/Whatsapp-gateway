/* eslint-disable react-hooks/rules-of-hooks */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest } from 'next/server';
import {
    makeWASocket,
    useMultiFileAuthState,
    ConnectionState,
    fetchLatestBaileysVersion,
    DisconnectReason
} from 'baileys';
import { ReadableStream } from 'web-streams-polyfill';
import P from 'pino';
import { prisma } from '@/helpers/prismaCall';

export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();

    try {
        const { searchParams } = new URL(req.url);
        const deviceId = searchParams.get('deviceId');

        if (!deviceId) return new Response('deviceId is required', { status: 400 });

        const device = await prisma.whatsAppDevice.findUnique({
            where: { id: deviceId },
            select: {
                id: true,
                name: true,
                phoneNumber: true,
                sessionData: true,
                isActive: true
            }
        });

        if (!device) return new Response('Device not found', { status: 404 });

        const stream = new ReadableStream({
            async start(controller) {
                // --- SSE bootstrap ---
                controller.enqueue(encoder.encode('retry: 15000\n\n')); // client retry 15s

                const ping = setInterval(() => {
                    try {
                        controller.enqueue(encoder.encode(`event: ping\ndata: {}\n\n`));
                    } catch { }
                }, 25000); // keep-alive

                const { state, saveCreds } = await useMultiFileAuthState(`auth/${deviceId}`);
                const { version } = await fetchLatestBaileysVersion();

                let sock = makeWASocket({
                    version,
                    auth: state,
                    logger: P({ level: 'silent' }),
                    printQRInTerminal: false,
                    syncFullHistory: false,
                    generateHighQualityLinkPreview: true,
                    markOnlineOnConnect: false
                });

                sock.ev.on('creds.update', saveCreds);

                const connectionListener = async (update: Partial<ConnectionState>) => {
                    const { connection, lastDisconnect, qr } = update;

                    if (qr) {
                        // kirim QR ke frontend
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify({ qr })}\n\n`)
                        );
                    }

                    if (connection === 'open') {
                        await prisma.whatsAppDevice.update({
                            where: { id: device.id },
                            data: { isActive: true }
                        });

                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({ connected: true, me: sock.user })}\n\n`
                            )
                        );
                        // **Jangan langsung close stream**; biarkan terbuka untuk heartbeat / notifikasi selanjutnya
                    }

                    if (connection === 'close') {
                        const statusCode =
                            (lastDisconnect?.error as any)?.output?.statusCode;
                        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                        await prisma.whatsAppDevice.update({
                            where: { id: device.id },
                            data: { isActive: false }
                        });

                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({
                                    connected: false,
                                    reason: statusCode,
                                    shouldReconnect
                                })}\n\n`
                            )
                        );

                        if (shouldReconnect) {
                            // Reconnect tanpa perlu rescan QR
                            try {
                                sock.ev.off('connection.update', connectionListener);
                                sock = makeWASocket({
                                    version,
                                    auth: state,
                                    logger: P({ level: 'silent' }),
                                    printQRInTerminal: false
                                });
                                sock.ev.on('creds.update', saveCreds);
                                sock.ev.on('connection.update', connectionListener);
                            } catch (err) {
                                controller.enqueue(
                                    encoder.encode(
                                        `data: ${JSON.stringify({ reconnectError: true })}\n\n`
                                    )
                                );
                                controller.close();
                            }
                        } else {
                            // loggedOut -> user harus rescan
                            controller.enqueue(
                                encoder.encode(
                                    `data: ${JSON.stringify({ needRescan: true })}\n\n`
                                )
                            );
                            controller.close();
                        }
                    }
                };

                sock.ev.on('connection.update', connectionListener);

                // Handle client abort (tab ditutup, dll.)
                req.signal.addEventListener('abort', () => {
                    try {
                        sock.ev.off('connection.update', connectionListener);
                        clearInterval(ping);
                        controller.close();
                    } catch { }
                });
            },
            cancel() { }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                Connection: 'keep-alive'
            }
        });
    } catch (err) {
        console.error(err);
        return new Response('Internal Server Error', { status: 500 });
    }
}
