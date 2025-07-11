import { NextResponse, NextRequest } from "next/server";
import { apiMiddleware } from "@/lib/middleware/apiMiddleware";
import { prisma } from "@helpers/prismaCall";

export async function GET(req: NextRequest) {
    try {
        const response = await apiMiddleware(req);
        const checkAuth = await response.json();
        if (checkAuth.code != 200) {
            return checkAuth;
        }
        
        const { searchParams } = new URL(req.url);

        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        const skip = (page - 1) * limit;

        // Query with filtering and pagination
        const [devices, total] = await Promise.all([
            prisma.whatsAppDevice.findMany({
                where: {
                    OR: [
                        { name: { contains: search.toLocaleLowerCase() } },
                        { phoneNumber: { contains: search.toLocaleLowerCase() } },
                        {userId: checkAuth.data.id}
                    ]
                },
                orderBy: {
                    createdAt: "desc"
                },
                skip,
                take: limit,
            }),
            prisma.whatsAppDevice.count({
                where: {
                    OR: [
                        { name: { contains: search.toLocaleLowerCase(), } },
                        { phoneNumber: { contains: search.toLocaleLowerCase(), } }
                    ]
                },
            })
        ]);

        return NextResponse.json({
            code: 200,
            message: "WhatsApp devices fetched successfully",
            data: devices,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Error fetching WhatsApp devices:", error);
        return NextResponse.json({
            code: 500,
            message: "Error fetching WhatsApp devices",
            error
        });
    }
}