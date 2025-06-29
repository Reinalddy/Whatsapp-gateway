import { apiMiddleware } from "@/lib/middleware/apiMiddleware";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@helpers/prismaCall";

export async function GET(req: NextRequest) {
    try {

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

        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc"
            },
        });

        return NextResponse.json({
            code: 200,
            message: "Get Users Success",
            data: users
        })
    } catch (error) {
        return NextResponse.json({
            code: 500,
            message: "Internal Server Error",
            data: error
        })
    }
}