/* eslint-disable react-hooks/rules-of-hooks */
export const runtime = 'nodejs';
import { makeWASocket, useMultiFileAuthState } from "baileys";
import * as fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/helpers/prismaCall";
import { apiMiddleware } from "@/lib/middleware/apiMiddleware";
import { generateBirthdayMessage } from "@/lib/openAi/generateBirthdayMessage";

/**
 * Kirim pesan WhatsApp ke nomor tujuan menggunakan Baileys
 * @param deviceId ID device yang sudah login
 * @param phoneNumber Nomor tujuan (dalam format internasional, contoh: 6281234567890)
 * @param message Isi pesan yang ingin dikirim
    */

export async function POST(req: NextRequest) {

    const response = await apiMiddleware(req);
    const checkAuth = await response.json();
    if (checkAuth.code != 200) {
        if (checkAuth.code != 200) {
            return NextResponse.json({
                'code': 500,
                'message': "Who are you?",
                'data': null
            });
        }
    }

    const { deviceId, phoneNumber, gender, ageUsers, usersName } = await req.json();

    if(!deviceId || !phoneNumber || !gender || !ageUsers || !usersName) {
        return NextResponse.json({
            code: 400,
            message: "Missing required fields"
        }, { status: 400 });
    }

    // Validasi format nomor HP (hanya angka dan panjang wajar)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
        return NextResponse.json({
            code: 400,
            message: "Invalid phone number format. Must be 10 to 15 digits and numeric only.",
        }, { status: 400 });
    }

    try {

        const age = ageUsers;
        const prompt = `Buatkan ucapan ulang tahun yang singkat, jelas, hangat, dan menyentuh hati untuk seseorang bernama ${usersName}, dengan jenis kelamin ${gender}, dan berumur ${age} tahun.Sesuaikan gaya ucapannya dengan jenis kelamin dan umur tersebut dan ucapkan umurnya. Hindari kalimat yang bertele-tele.`;

        // GENERATE MESSAGE
        const message = await generateBirthdayMessage(prompt); 

        // CARI DEVICE DI DATABASE
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
            return NextResponse.json({
                code: 404,
                message: "Device not found",
            }, { status: 404 });
        }

        if (!device.isActive) {
            return NextResponse.json({
                code: 400,
                message: "Device is not active. Please scan the QR code first.",
            }, { status: 400 });
        }

        const authDir = `auth/${deviceId}`;

        // Pastikan direktori autentikasi masih ada
        if (!fs.existsSync(authDir)) {
            throw new Error("Session not found. Please login again.");
        }

        // Ambil state dan fungsi penyimpanan session
        const { state, saveCreds } = await useMultiFileAuthState(authDir);
        const sock = makeWASocket({ auth: state });
        // Simpan session jika ada perubahan
        sock.ev.on("creds.update", saveCreds);

        // CREATE DATABASE MESSAGE LOG
        await prisma.whatsAppMessageWithAi.create({
            data: {
                deviceId: device.id,
                content: message!,
                sender: device.phoneNumber,
                recipient: phoneNumber,
                status: "pending", // Status awal adalah pending
                userId: checkAuth.data.id,
            },
        });

        // Tunggu koneksi terbuka dulu
        let isConnected = false;
        // Gunakan Promise untuk menunggu koneksi
        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
                if (!isConnected) {
                    // UPDATE STATUS MESSAGE LOG KE TIMEOUT
                    prisma.whatsAppMessage.updateMany({
                        where: {
                            deviceId: device.id,
                            recipient: phoneNumber,
                        },
                        data: {
                            status: "failed", // Update status ke timeout
                            notes: "Connection timeout",
                        },
                    });

                    reject(new Error("Connection timeout"))
                }
            }, 10000); // timeout 10 detik

            sock.ev.on("connection.update", (update) => {
                if (update.connection === "open") {
                    isConnected = true;
                    clearTimeout(timeout);
                    resolve();
                }

                if (update.connection === "close") {
                    clearTimeout(timeout);
                    // UPDATE STATUS MESSAGE LOG KE CONNECTION CLOSED
                    prisma.whatsAppMessage.updateMany({
                        where: {
                            deviceId: device.id,
                            recipient: phoneNumber,
                        },
                        data: {
                            status: "failed", // Update status ke timeout
                            notes: "Connection closed",
                        },
                    });
                    reject(new Error("Connection closed"));
                }
            });
        })

        // Format nomor tujuan ke format JID
        const jid = phoneNumber.includes("@s.whatsapp.net") ? phoneNumber : `${phoneNumber}@s.whatsapp.net`;

        if (sock?.user) {
            // Kirim pesan teks
            try {
                await sock.sendMessage(jid, { text: message! });
            } catch (error) {
                await prisma.whatsAppMessageWithAi.updateMany({
                    where: {
                        deviceId: device.id,
                        recipient: phoneNumber,
                    },
                    data: {
                        status: "failed", // Update status ke timeout
                        notes: "Failed to send message",
                    },
                });
                return NextResponse.json({
                    code: 500,
                    message: "Failed to send message",
                    error: error
                }, { status: 500 });
            }

            await prisma.whatsAppMessageWithAi.updateMany({
                where: {
                    deviceId: device.id,
                    recipient: phoneNumber,
                },
                data: {
                    status: "success", // Update status ke timeout
                    notes: "Message sent successfully",
                },
            });

            return NextResponse.json({
                code: 200,
                message: "Message sent successfully",
                data: {
                    deviceId: device.id,
                    phoneNumber: jid,
                    message: message,
                }
            });
        } else {
            await prisma.whatsAppMessageWithAi.updateMany({
                where: {
                    deviceId: device.id,
                    recipient: phoneNumber,
                },
                data: {
                    status: "failed", // Update status ke timeout
                    notes: "WhatsApp device not connected",
                },
            });
            return NextResponse.json({
                code: 400,
                message: "WhatsApp device not connected",
                data: {
                    deviceId: device.id,
                    phoneNumber: jid,
                    message: message,
                }
            });
        }

    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "Error sending message",
            error
        });

    }
}
