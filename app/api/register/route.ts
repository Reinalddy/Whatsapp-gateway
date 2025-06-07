import { NextResponse } from "next/server";
// import { PrismaClient } from "prisma";
import { PrismaClient } from "@/app/generated/prisma";
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export async function POST(request: Request) {
    const body = await request.json();
    const {name, email, phoneNumber, password} = body;

    if(!name || !email || !phoneNumber || !password) {
        return NextResponse.json({
            code : 400,
            message : "all field is required",
            data : body
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({
            code: 400,
            message: "Invalid email format",
            data : null
        });
    }

    if (password.length < 8) {
        return NextResponse.json({
            code: 400,
            message: "Password must be at least 8 characters",
            data : null
        });
    }

    const existingUser = await prisma.user.findUnique({ where: {email} });

    if(existingUser) {
        return NextResponse.json({
            code: 400,
            message: "Users alredy Registered",
            data: body
        });
    }

    const existingPhone = await prisma.user.findUnique({
        where: {phoneNumber},
    });

    if (existingPhone) {
        return NextResponse.json({
            code: 400,
            message: "Phone number already registered",
            data : null,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            role: {
                connect: {
                    name: "user"
                }
            }
        }
    });

    return NextResponse.json({
        code : 200,
        message : "Register Success",
        data : user.id
    })
}