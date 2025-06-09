import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../jwt/jwt';

export async function apiMiddleware(request: NextRequest) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
        return NextResponse.json({
            code: 400,
            message: "No Authorization header",
            data: null
        });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    try {
        const decoded = verifyToken(token);
        console.log(decoded);
        return NextResponse.json({
            code: 200,
            message: "Token valid",
            data: decoded
        });
    } catch (err) {
        console.error("JWT Error:", err);

        return NextResponse.json({
            code: 400,
            message: "Invalid or expired token",
            data: null
        });
    }
}