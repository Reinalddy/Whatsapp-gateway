// lib/jwt/verify.ts
import { jwtVerify } from 'jose';

export async function verifyToken(token: string) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
}
