import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/helpers/prismaCall";
import { apiMiddleware } from "@/lib/middleware/apiMiddleware";

export async function GET(req:NextRequest) {
    try {
        
        const response = await apiMiddleware(req);
        const checkAuth = await response.json();
        if (checkAuth.code != 200) {
            return checkAuth;
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '5');
        const skip = (page - 1) * limit;
        const status = searchParams.get('status') || '';

        const where = {
            userId: checkAuth.data.id,
            // STATUS SEARCH ONLY APPLY IF STATUS IS NOT EMPTY
            ...(status && { status: status }),
            ...(search && {
                OR: [
                    { content: { contains: search } },
                    { sender: { contains: search } },
                    { recipient: { contains: search } },
                ],
            }),
          };

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
            data:{
                    "messages": messages,
                    "total": total,
                    "page": page,
                    "totalPages": Math.ceil(total / limit)
                }
            
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