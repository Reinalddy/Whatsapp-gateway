// app/users/layout.tsx
import { ReactNode } from 'react';
import Sidebar from '@/component/Sidebar';
import ClientWrapper from './ClientWrapper'; // 👇 client component
import { getUserFromToken } from '@/lib/authentication/getUserFromToken';

interface User {
    id: string;
    email: string;
    role: string;
}
export default async function UsersLayout({ children }: { children: ReactNode }) {
    const userData = await getUserFromToken() as User;
    return (
        <div className="flex w-screen bg-gray-100">
            <Sidebar user={userData} />
            <ClientWrapper>{children}</ClientWrapper>
        </div>
      );
}