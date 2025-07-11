import { NextRequest, NextResponse } from "next/server";
import { apiMiddleware } from "@/lib/middleware/apiMiddleware";
import { prisma } from "@/helpers/prismaCall";
export async function GET(req: NextRequest) {

    // GET ALL DEVICE USERS
    // TEMPORARY GET ALL DEVICE
    // TODO REI ADD SPESIFIK ID
    try {
        
        const response = await apiMiddleware(req);
        const checkAuth = await response.json();
        if (checkAuth.code != 200) {
            return checkAuth;
        }
        
        const device = await prisma.whatsAppDevice.findMany({
            orderBy: {
                createdAt: "desc"
            },
            where: {
                isActive: true,
                userId: checkAuth.data.id
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