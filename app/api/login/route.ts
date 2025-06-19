import { NextResponse } from "next/server";
import { prisma } from "@/helpers/prismaCall";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/jwt/jwt";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    if(!email || !password) {
        return NextResponse.json({
            code : 400,
            message: "Email and password are required",
            data : null
        });
    }
    
    try {

        const user = await prisma.user.findUnique({
            where: {email},
            include: {role: true}
        });
        
        if(!user) {
            return NextResponse.json({
                code: 400,
                message: "Invalid credentials",
                data: null
            })
        }

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role.name
        });
        

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if(!passwordMatch) {
            return NextResponse.json({
                code: 400,
                message: "Invalid credentials",
                data : null
            });
        }

        const response = NextResponse.json({
            code: 200,
            message: 'Login success',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role.name,
                token: token
            },
        });

        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 hari
        });

        return response;
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            code: 500,
            message: "Something Really wrong",
            data : error
        });
    }

}