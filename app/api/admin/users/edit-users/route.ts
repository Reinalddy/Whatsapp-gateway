import { apiMiddleware } from "@/lib/middleware/apiMiddleware";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@helpers/prismaCall";

export async function POST(req: NextRequest) {
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

        // EDIT USERS CURENTLY ADMIN ONLY CAN EDIT STATUS USERS AND ROLE
        const {role, status, id} = await req.json();

        // CHECK APAKAH ROLE NYA VALID
        const checkRole = await prisma.role.findUnique({
            where: {
                id: role
            }
        });

        if (!checkRole) {
            return NextResponse.json({
                'code': 400,
                'message': "Role Not Found",
                'data': null
            })
        }

        const user = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                roleId: role,
                status: status
            }
        });

        return NextResponse.json({
            'code': 200,
            'message': "Edit User Success",
            'data': user
        })

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            'code': 500,
            'message': "something really wrong",
            'data' : error
        })
    }
}