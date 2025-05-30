export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { prisma } from "@helpers/prismaCall";
import * as fs from "fs";

export async function DELETE(req: Request) {
    try {
        const {deviceId} = await req.json();
        if (!deviceId) {
            return NextResponse.json({
                code: 400,
                message: "Device ID is required"
            });
        }
        // Delete the WhatsApp device by ID
        const deletedDevice = await prisma.whatsAppDevice.delete({
            where: {
                id: deviceId
            }
        });

        const authDir = `auth/${deviceId}`;

        // DELETE AUTH DIRECTORY
        if (!fs.existsSync(authDir)) {
            // CONTINUE IF AUTH DIR NOT FOUND
        } else {
            // Hapus direktori autentikasi
            fs.rmSync(authDir, { recursive: true, force: true });
        }

        return NextResponse.json({
            code: 200,
            message: "WhatsApp device deleted successfully",
            data: deletedDevice
        });
        
    } catch (error) {
        console.error("Error deleting WhatsApp device:", error);
        return NextResponse.json({
            code: 500,
            message: "Error deleting WhatsApp device",
            error
        });
        
    }
}