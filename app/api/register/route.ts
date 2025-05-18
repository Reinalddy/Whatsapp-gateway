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

    const existingUser = await prisma.user.findUnique({ where: {email} });

    if(existingUser) {
        return NextResponse.json({
            code: 400,
            message: "Users alredy Registered",
            data: body
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            phoneNumber,
            password: hashedPassword,
        }
    });

    return NextResponse.json({
        code : 200,
        message : "Register Success",
        data : user.id
    })
}