// app/users/layout.tsx
import type { ReactNode } from 'react'
import Sidebar from '@/component/Sidebar'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt/jwt'

export default async function UsersLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = token ? verifyToken(token) : null;

    if(!user) {
        return (
            <div className='flex w-screen bg-gray-100'>
                <h1>Unauthorized</h1>
            </div>
        )
    }
    return (
        <div className="flex w-screen bg-gray-100">
            <Sidebar />
            {children}
        </div>
    )
}