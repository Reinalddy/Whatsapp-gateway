import { prisma } from "@helpers/prismaCall";
import { NextRequest, NextResponse } from "next/server";
import { apiMiddleware } from "@/lib/middleware/apiMiddleware";


export async function POST(req: NextRequest) {
    try {
        const response = await apiMiddleware(req);
        const checkAuth = await response.json();
        if (checkAuth.code != 200) {
            return checkAuth;
        }

        const body = await req.json();
        const { deviceName, deviceNumber } = body;
    
        const newDevice = await prisma.whatsAppDevice.create({
            data: {
                // id: crypto.randomUUID(),
                name: deviceName,
                // sessionData: "{}",
                userId: checkAuth.data.id,
                phoneNumber: deviceNumber,
                isActive: false,
                // createdAt: new Date(),
                // updatedAt: new Date(),
            }
        });
    
       return NextResponse.json({
            code: 200,
            message: "WhatsApp device created successfully",
            data: newDevice
       })
        
    } catch (error) {
        console.error("Error creating WhatsApp device:", error);
        return NextResponse.json({
            code: 500,
            message: "Error creating WhatsApp device",
            data: error
        })
    }
}
