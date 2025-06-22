import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/helpers/prismaCall";
import { apiMiddleware } from "@/lib/middleware/apiMiddleware";

export async function GET(req: NextRequest) {
    try {
        // GET ALL MESSAGES USERS
        const response = await apiMiddleware(req);
        const checkAuth = await response.json();
        if (checkAuth.code != 200) {
            return checkAuth;
        }

        // CHECK ROLE USERS, JIKA BUKAN ADMIN MAKA TOLAK REQUEST NYA
        if (checkAuth.data.role != 'admin') {
            return NextResponse.json({
                code: 403,
                message: "Who are you?",
                data: checkAuth
            })
        }

        const messages = await prisma.whatsAppMessage.findMany({
            orderBy: {
                createdAt: "desc"
            },
        });

        const messagesAi = await prisma.whatsAppMessageWithAi.findMany({
            orderBy: {
                createdAt: "desc"
            },
        });

        // MERGE MESSAGES AND MESSAGES AI
        const allMessages = [...messages, ...messagesAi];

        return NextResponse.json({
            'code': 200,
            'message': "success",
            'data': allMessages
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            'code': 500,
            'message': "something really wrong",
            'data': error
        });
    }
}