/* eslint-disable react-hooks/rules-of-hooks */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest } from "next/server";
import {
    makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    ConnectionState,
} from "baileys";
import P from "pino";
import { prisma } from "@/helpers/prismaCall";
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();

    try {
        const { searchParams } = new URL(req.url);
        const deviceId = searchParams.get("deviceId");

        if (!deviceId) return new Response("deviceId is required", { status: 400 });

        // Pastikan folder auth global ada
        const authDir = path.join(process.cwd(), 'auth', deviceId);
        if (!fs.existsSync(authDir)) {
            fs.mkdirSync(authDir, { recursive: true });
        }

        // Pastikan folder auth per device ada
        const deviceAuthDir = path.join(authDir, deviceId);
        if (!fs.existsSync(deviceAuthDir)) {
            fs.mkdirSync(deviceAuthDir, { recursive: true });
        }

        const device = await prisma.whatsAppDevice.findUnique({
            where: { id: deviceId },
            select: {
                id: true,
                name: true,
                phoneNumber: true,
                sessionData: true,
                isActive: true,
            },
        });

        if (!device) return new Response("Device not found", { status: 404 });

        const stream = new ReadableStream({
            async start(controller) {
                const send = (data: any, event?: string) => {
                    let payload = "";
                    if (event) payload += `event: ${event}\n`;
                    payload += `data: ${JSON.stringify(data)}\n\n`;
                    controller.enqueue(encoder.encode(payload));
                };

                // 🔹 Status awal connecting
                send({ status: "connecting" });

                // 🔹 Keep alive ping tiap 25 detik
                const ping = setInterval(() => send({}, "ping"), 25000);

                // const { state, saveCreds } = await useMultiFileAuthState(`auth/${deviceId}`);
                const { state, saveCreds } = await useMultiFileAuthState(authDir);
                const { version } = await fetchLatestBaileysVersion();

                let sock = makeWASocket({
                    version,
                    auth: state,
                    logger: P({ level: "silent" }),
                    printQRInTerminal: false,
                    syncFullHistory: false,
                    generateHighQualityLinkPreview: true,
                    markOnlineOnConnect: false,
                });

                sock.ev.on("creds.update", saveCreds);

                const connectionListener = async (update: Partial<ConnectionState>) => {
                    const { connection, lastDisconnect, qr } = update;

                    if (qr) {
                        send({ qr });
                    }

                    if (connection === "open") {
                        await prisma.whatsAppDevice.update({
                            where: { id: device.id },
                            data: { isActive: true },
                        });

                        send({ connected: true, me: sock.user });
                        // Kalau mau stream tetap jalan untuk notifikasi, jangan close di sini
                        // Kalau cuma QR flow, boleh close:
                        clearInterval(ping);
                        controller.close();
                    }

                    if (connection === "close") {
                        const statusCode =
                            (lastDisconnect?.error as any)?.output?.statusCode;
                        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                        await prisma.whatsAppDevice.update({
                            where: { id: device.id },
                            data: { isActive: false },
                        });

                        send({
                            connected: false,
                            reason: statusCode,
                            shouldReconnect,
                        });

                        if (shouldReconnect) {
                            // reconnect tanpa rescan
                            try {
                                sock.ev.off("connection.update", connectionListener);
                                sock = makeWASocket({
                                    version,
                                    auth: state,
                                    logger: P({ level: "silent" }),
                                    printQRInTerminal: false,
                                });
                                sock.ev.on("creds.update", saveCreds);
                                sock.ev.on("connection.update", connectionListener);
                            } catch {
                                send({ reconnectError: true });
                                clearInterval(ping);
                                controller.close();
                            }
                        } else {
                            // logged out, harus rescan
                            send({ needRescan: true });
                            clearInterval(ping);
                            controller.close();
                        }
                    }
                };

                sock.ev.on("connection.update", connectionListener);

                req.signal.addEventListener("abort", () => {
                    sock.ev.off("connection.update", connectionListener);
                    clearInterval(ping);
                    controller.close();
                });
            },
        });

        return new Response(stream as any, {
            headers: {
                "Content-Type": "text/event-stream; charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
                Connection: "keep-alive",
            },
        });
    } catch (err) {
        console.error(err);
        return new Response("Internal Server Error", { status: 500 });
    }
}