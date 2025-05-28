import { prisma } from "@helpers/prismaCall";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { deviceName, deviceNumber } = body;
    
        const newDevice = await prisma.whatsAppDevice.create({
            data: {
                name: deviceName,
                sessionData: "",
                phoneNumber: deviceNumber,
                isActive: false,
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
