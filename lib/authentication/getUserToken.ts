'use server';

import { cookies } from 'next/headers';

export async function getUserToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {        
        return token;
    } catch (err) {
        console.log(err)
        return null;
    }
  }