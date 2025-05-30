import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/helpers/prismaCall";

export async function GET(req:NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '5');
        const skip = (page - 1) * limit;

        const where = search
            ? {
                OR: [
                    { content: { contains: search, mode: 'insensitive' } },
                    { sender: { contains: search, mode: 'insensitive' } },
                    { recipient: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};

        const [messages, total] = await Promise.all([
            prisma.whatsAppMessage.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.whatsAppMessage.count({ where }),
        ]);

        return NextResponse.json({
            code: 200,
            message: "Fetch Data success",
            data: [
                {
                    "messages": messages,
                    "total": total,
                    "page": page,
                    "totalPages": Math.ceil(total / limit)
                }
            ]
        })
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            code: 500,
            message: "Error",
            data: error
        })
    }
   
}