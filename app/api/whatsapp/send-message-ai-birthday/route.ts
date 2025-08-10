/* eslint-disable react-hooks/rules-of-hooks */
export const runtime = 'nodejs';

import {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    type ConnectionState,
    type WASocket
} from 'baileys';
import * as fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/helpers/prismaCall';
import { apiMiddleware } from '@/lib/middleware/apiMiddleware';
import { generateBirthdayMessage } from '@/lib/openAi/generateBirthdayMessage';
import type { Boom } from '@hapi/boom';

type SendStatus = 'pending' | 'success' | 'failed';

export async function POST(req: NextRequest) {
    try {
        // ===== Auth =====
        const response = await apiMiddleware(req);
        const checkAuth = await response.json();
        if (checkAuth.code !== 200) {
            return NextResponse.json(
                { code: 401, message: 'Who are you?', data: null },
                { status: 401 }
            );
        }

        // ===== Validate body =====
        const { deviceId, phoneNumber, gender, ageUsers, usersName } = await req.json();

        if (!deviceId || !phoneNumber || !gender || !ageUsers || !usersName) {
            return NextResponse.json(
                { code: 400, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return NextResponse.json(
                {
                    code: 400,
                    message: 'Invalid phone number format. Must be 10 to 15 digits and numeric only.'
                },
                { status: 400 }
            );
        }

        // ===== Check device =====
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

        if (!device) {
            return NextResponse.json(
                { code: 404, message: 'Device not found' },
                { status: 404 }
            );
        }

        if (!device.isActive) {
            return NextResponse.json(
                {
                    code: 400,
                    message: 'Device is not active. Please scan the QR code first.'
                },
                { status: 400 }
            );
        }

        // ===== Ensure session exists =====
        const authDir = `auth/${deviceId}`;
        if (!fs.existsSync(authDir)) {
            return NextResponse.json(
                {
                    code: 400,
                    message: 'Session not found. Please login again.'
                },
                { status: 400 }
            );
        }

        // ===== Generate message with OpenAI =====
        const prompt = `Buatkan ucapan ulang tahun yang singkat, jelas, hangat, dan menyentuh hati untuk seseorang bernama ${usersName}, dengan jenis kelamin ${gender}, dan berumur ${ageUsers} tahun. Sesuaikan gaya ucapannya dengan jenis kelamin dan umur tersebut dan ucapkan umurnya. Hindari kalimat yang bertele-tele.`;
        const message = await generateBirthdayMessage(prompt);

        // ===== Create initial message log =====
        await createOrUpdateLog(
            'pending',
            {
                deviceId: device.id,
                sender: device.phoneNumber,
                recipient: phoneNumber,
                content: message ?? '',
                userId: checkAuth.data.id
            },
            'queued'
        );

        // ===== Init WA & wait connection =====
        const { state, saveCreds } = await useMultiFileAuthState(authDir);
        const { version } = await fetchLatestBaileysVersion();
        const sock = makeWASocket({ version, auth: state });
        sock.ev.on('creds.update', saveCreds);

        try {
            await waitForConnectionOpen(sock, 10_000); // 10s timeout
        } catch (err) {
            await createOrUpdateLog(
                'failed',
                {
                    deviceId: device.id,
                    recipient: phoneNumber
                },
                `Connection not open: ${String(err)}`
            );

            return NextResponse.json(
                {
                    code: 500,
                    message: 'Connection not open',
                },
                { status: 500 }
            );
        }

        if (!sock.user) {
            await createOrUpdateLog(
                'failed',
                {
                    deviceId: device.id,
                    recipient: phoneNumber
                },
                'WhatsApp device not connected'
            );

            return NextResponse.json(
                {
                    code: 400,
                    message: 'WhatsApp device not connected',
                    data: { deviceId: device.id, phoneNumber: toJid(phoneNumber), message }
                },
                { status: 400 }
            );
        }

        // ===== Send message =====
        try {
            await sock.sendMessage(toJid(phoneNumber), { text: message ?? '' });

            await createOrUpdateLog(
                'success',
                {
                    deviceId: device.id,
                    recipient: phoneNumber
                },
                'Message sent successfully'
            );

            return NextResponse.json({
                code: 200,
                message: 'Message sent successfully',
                data: {
                    deviceId: device.id,
                    phoneNumber: toJid(phoneNumber),
                    message
                }
            });
        } catch (err) {
            await createOrUpdateLog(
                'failed',
                {
                    deviceId: device.id,
                    recipient: phoneNumber
                },
                `Failed to send message: ${String(err)}`
            );

            return NextResponse.json(
                {
                    code: 500,
                    message: 'Failed to send message',
                    error: String(err)
                },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            {
                code: 500,
                message: 'Error sending message',
                error: String(error)
            },
            { status: 500 }
        );
    }
}

/**
 * Tunggu sampai connection "open" atau throw error dengan reason yang jelas.
 */
async function waitForConnectionOpen(sock: WASocket, timeoutMs: number) {
    return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
            sock.ev.off('connection.update', onConnectionUpdate);
            reject(new Error('Connection timeout'));
        }, timeoutMs);

        const onConnectionUpdate = (update: Partial<ConnectionState>) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'open') {
                clearTimeout(timeout);
                sock.ev.off('connection.update', onConnectionUpdate);
                resolve();
            }

            if (connection === 'close') {
                clearTimeout(timeout);
                sock.ev.off('connection.update', onConnectionUpdate);

                const boomError = lastDisconnect?.error as Boom | undefined;
                const statusCode = boomError?.output?.statusCode;

                if (statusCode === DisconnectReason.loggedOut) {
                    reject(new Error('Logged out, need to re-scan QR'));
                } else {
                    reject(new Error('Connection closed'));
                }
            }
        };

        sock.ev.on('connection.update', onConnectionUpdate);
    });
}

/**
 * Update log pesan (create ketika status pending, update ketika success/failed).
 */
async function createOrUpdateLog(
    status: SendStatus,
    whereOrData: {
        deviceId: string;
        recipient: string;
        sender?: string;
        content?: string;
        userId?: number;
    },
    notes: string
) {
    const { deviceId, recipient } = whereOrData;

    if (status === 'pending') {
        await prisma.whatsAppMessageWithAi.create({
            data: {
                deviceId,
                recipient,
                sender: whereOrData.sender ?? '',
                content: whereOrData.content ?? '',
                status,
                notes,
                userId: Number(whereOrData.userId)
            }
        });
        return;
    }

    await prisma.whatsAppMessageWithAi.updateMany({
        where: { deviceId, recipient, status: 'pending' },
        data: {
            status,
            notes
        }
    });
}

/**
 * Pastikan JID valid.
 */
function toJid(phoneNumber: string) {
    return phoneNumber.includes('@s.whatsapp.net')
        ? phoneNumber
        : `${phoneNumber}@s.whatsapp.net`;
}