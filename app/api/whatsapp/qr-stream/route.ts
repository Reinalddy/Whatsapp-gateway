// app/api/whatsapp/qr-stream/route.ts
/* eslint-disable react-hooks/rules-of-hooks */
export const runtime = 'nodejs';

import { NextRequest } from "next/server";
import { getWhatsAppInstance } from "../../../../lib/whatsapp/whatsapp";
import { makeWASocket, useMultiFileAuthState } from "baileys";
// import { ReadableStream } from "web-streams-polyfill";
import { ReadableStream } from "web-streams-polyfill";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("deviceId");

    if (!deviceId) {
        return new Response("deviceId is required", { status: 400 });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const { state, saveCreds } = await useMultiFileAuthState(`auth/${deviceId}`);
            const sock = makeWASocket({ auth: state });

            sock.ev.on("creds.update", saveCreds);

            sock.ev.on("connection.update", ({ connection, qr }) => {
                if (qr) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ qr })}\n\n`));
                }

                if (connection === "open") {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ connected: true })}\n\n`));
                    controller.close();
                }

                if (connection === "close") {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ connected: false })}\n\n`));
                }
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
