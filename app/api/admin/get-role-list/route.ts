import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/helpers/prismaCall";
import { apiMiddleware } from "@/lib/middleware/apiMiddleware";

export async function GET(req: NextRequest) {
    try {
        const response = await apiMiddleware(req);
        const checkAuth = await response.json();
        if (checkAuth.code != 200) {
            return checkAuth;
        }
        // GET ROLE LIST
        const roleList = await prisma.role.findMany();
        return NextResponse.json({
            'code': 200,
            'message': "success",
            'data' : roleList
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