import { NextResponse } from "next/server";
import { prisma } from "@/helpers/prismaCall";
export async function GET() {

    // GET ALL DEVICE USERS
    // TEMPORARY GET ALL DEVICE
    // TODO REI ADD SPESIFIK ID

    try {
        const device = await prisma.whatsAppDevice.findMany({
            orderBy: {
                createdAt: "desc"
            },
            where: {
                isActive: true
            }
        });

        return NextResponse.json({
            code: 200,
            message: "Get Device Succees",
            data: device
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            code: 500,
            message: "Failed Get Device",
            data : error
        });
    }
}