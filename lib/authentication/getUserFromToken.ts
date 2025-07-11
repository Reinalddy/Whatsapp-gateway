'use server';

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt/jwt';

export async function getUserFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {        
        const user = verifyToken(token) as {
            id: string;
            email: string;
            role: string;
        };

        return user;
    } catch (err) {
        console.log(err)
        return null;
    }
  }