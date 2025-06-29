import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const cookieStore = await cookies();
        // Hapus cookie token
        cookieStore.set({
            name: 'token',
            value: '',
            path: '/',
            expires: new Date(0), // expired
        });
    
        return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
        
    } catch (error) {
        console.log("error logout" + error);

        return NextResponse.json({
            'code': 500,
            'message': "something really wrong",
            'data' : error
        });
    }
}