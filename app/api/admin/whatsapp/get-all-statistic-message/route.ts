import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@helpers/prismaCall";
import { apiMiddleware } from "@/lib/middleware/apiMiddleware";

export async function GET(req: NextRequest) {
    try {
        const response = await apiMiddleware(req);
        const checkAuth = await response.json();
        if (checkAuth.code != 200) {
            return checkAuth;
        }

        // CHECK ROLE USERS, JIKA BUKAN ADMIN MAKA TOLAK REQUEST NYA
        if (checkAuth.data.role !== 'admin') {
            return NextResponse.json({
                code: 403,
                message: "Who are you?",
                data: null
            })
        }
        
        // GET MESSAGES WITH STATUS PENDING
        const pendingMessages = await prisma.whatsAppMessage.count({
            where: {
                status: 'pending',
       
            }
        });

        // GET MESSAGES WITH STATUS FAILED
        const failedMessages = await prisma.whatsAppMessage.count({
            where: {
                status: 'failed',
            }
        });

        // GET MESSAGES WITH STATUS SUCCESS
        const successMessages = await prisma.whatsAppMessage.count({
            where: {
                status: 'success',
            }
        });

        // GET ALL MESSAGES
        const allMessages = await prisma.whatsAppMessage.count();
        
        // GET AI MESSAGES
        // GET MESSAGES WITH STATUS PENDING
        const pendingMessagesAi = await prisma.whatsAppMessageWithAi.count({
            where: {
                status: 'pending',
       
            }
        });

        // GET MESSAGES WITH STATUS FAILED
        const failedMessagesAi = await prisma.whatsAppMessageWithAi.count({
            where: {
                status: 'failed',
       
            }
        });

        // GET MESSAGES WITH STATUS SUCCESS
        const successMessagesAi = await prisma.whatsAppMessageWithAi.count({
            where: {
                status: 'success',
       
            }
        });

        // GET ALL MESSAGES
        const allMessagesAi = await prisma.whatsAppMessageWithAi.count();


        const result = {
            'pending': pendingMessages + pendingMessagesAi,
            'failed': failedMessages + failedMessagesAi,
            'success': successMessages + successMessagesAi,
            'all': allMessages + allMessagesAi,
        }

        return NextResponse.json({
            'code': 200,
            'message': 'success',
            'data': result
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            'code': 500,
            'message': "something really wrong",
            'data' : error
        });
    }
}