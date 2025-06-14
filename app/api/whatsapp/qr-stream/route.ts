/* eslint-disable react-hooks/rules-of-hooks */
export const runtime = 'nodejs';

import { NextRequest } from "next/server";
import { makeWASocket, useMultiFileAuthState, ConnectionState } from "baileys";
import { ReadableStream } from "web-streams-polyfill";
import { prisma } from "@/helpers/prismaCall";
// import { apiMiddleware } from "@/lib/middleware/apiMiddleware";

export async function GET(req: NextRequest) {

    try {
        // const response = await apiMiddleware(req);
        // const checkAuth = await response.json();
        // if (checkAuth.code != 200) {
        //     return checkAuth;
        // }

        const { searchParams } = new URL(req.url);
        const deviceId = searchParams.get("deviceId");

        if (!deviceId) {
            return new Response("deviceId is required", { status: 400 });
        }

        // SEARCH DEVICE IN DATABASE
        const device = await prisma.whatsAppDevice.findUnique({
            where: {
                id: deviceId,
            },
            select: {
                id: true,
                name: true,
                phoneNumber: true,
                sessionData: true,
                isActive: true,
            },
        });

        if (!device) {
            return new Response("Device not found", { status: 404 });
        }

        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                const { state, saveCreds } = await useMultiFileAuthState(`auth/${deviceId}`);
                const sock = makeWASocket({ auth: state });

                sock.ev.on("creds.update", saveCreds);

                const connectionListener = async (update: Partial<ConnectionState>) => {
                    try {
                        if (update.qr) {
                            console.error("QR code received for device:", deviceId);
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ qr: update.qr })}\n\n`));
                        }

                        if (update.connection === "open") {
                            // UPDATE DEVICE AS ACTIVE
                            // console.error("Device is active:", deviceId);
                            await prisma.whatsAppDevice.update({
                                where: { id: device.id },
                                data: {
                                    isActive: true,
                                    sessionData: JSON.stringify(state)
                                },
                            });

                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ connected: true })}\n\n`));
                            controller.close();
                            sock.ev.off("connection.update", connectionListener);
                        }

                        if (update.connection === "close") {
                            // UPDATE DEVICE AS INACTIVE
                            await prisma.whatsAppDevice.update({
                                where: { id: deviceId },
                                data: { isActive: false, sessionData: JSON.stringify(state) },
                            });

                            // USER MUST RE-SCAN QR CODE
                            console.log("Device connection closed, user must re-scan QR code:", deviceId);

                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ connected: false })}\n\n`));
                            controller.close();
                            sock.ev.off("connection.update", connectionListener);
                        }
                    } catch (error) {
                        console.error("Error processing connection update:", error);
                        try {
                            controller.close();
                        } catch (error) {
                            console.error("Error closing stream:", error);
                        }
                        sock.ev.off("connection.update", connectionListener);
                    }
                };

                sock.ev.on("connection.update", connectionListener);
            },
            cancel() {
                // Optional cleanup logic
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.log(error);
        // return NextResponse.json({
        //     code : 500,
        //     message: "Server Failed",
        //     data : error
        // });
    }


}
