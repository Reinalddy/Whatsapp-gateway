/* eslint-disable react-hooks/rules-of-hooks */
import makeWASocket, { useMultiFileAuthState } from "baileys";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function connectToWhatsApp(deviceId: string) {
    const { state, saveCreds } = await useMultiFileAuthState(`./auth/${deviceId}`);
    const sock = makeWASocket({ auth: state });

    sock.ev.on('connection.update', async ({ connection, qr }) => {
        if (connection === 'open') {
            await prisma.whatsAppDevice.update({
                where: { id: deviceId },
                data: { isActive: true },
            });
        }

        if (connection === 'close') {
            await prisma.whatsAppDevice.update({
                where: { id: deviceId },
                data: { isActive: false },
            });
        }

        if (qr) {
            // Save QR for front-end to poll
        }
    });

    sock.ev.on('creds.update', saveCreds);

    return sock;
}