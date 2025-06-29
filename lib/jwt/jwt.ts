import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your_key";

type DecodedToken = {
    id: string;
    name: string;
    email: string;
    role: string;
}

export function generateToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: '1d'})
}

export function verifyToken(token: string): DecodedToken | null {
    try {
        return jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
        console.log("JWT ERROR VERIFY "+ error);
        return null;
    }
}