// app/api/whatsapp/send-message/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppInstance } from "../../../../lib/whatsapp/whatsapp";

export async function POST(req: NextRequest) {
    const { to, message, deviceId } = await req.json();

    if (!to || !message || !deviceId) {
        return NextResponse.json({ 
            code: 400,
            message: "all field is required",
            data: { to, message, deviceId }
        }
        );
    }

    try {
        const sock = await getWhatsAppInstance(deviceId);
        await sock.sendMessage(`${to}@s.whatsapp.net`, { text: message });

        return NextResponse.json({
            code: 200,
            message: "Message sent successfully",
            data: { to, message, deviceId }
        });
    } catch (error) {
        console.error("Failed to send message:", error);
        return NextResponse.json({
            code: 500,
            message: "Failed to send message",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}
