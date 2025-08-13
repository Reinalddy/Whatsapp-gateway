import { NextResponse } from "next/server";
import { prisma } from "@/helpers/prismaCall";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/jwt/jwt";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json(
            {
                code: 400,
                message: "Email and password are required",
                data: null,
            },
            { status: 400 }
        );
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });

        if (!user) {
            return NextResponse.json(
                {
                    code: 400,
                    message: "Invalid credentials",
                    data: null,
                },
                { status: 400 }
            );
        }

        // Cek status akun
        if (user.status === "inactive") {
            return NextResponse.json(
                {
                    code: 400,
                    message: "Your account is inactive",
                    data: null,
                },
                { status: 400 }
            );
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json(
                {
                    code: 400,
                    message: "Invalid credentials",
                    data: null,
                },
                { status: 400 }
            );
        }

        // Buat JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role.name,
            name: user.name,
        });

        const response = NextResponse.json(
            {
                code: 200,
                message: "Login success",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role.name,
                },
            },
            { status: 200 }
        );

        // Set cookie HttpOnly
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS only in prod
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 hari
        });

        // Tambahkan CORS credentials
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_BASE_URL || "*");

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                code: 500,
                message: "Something went wrong",
                data: error,
            },
            { status: 500 }
        );
    }
}