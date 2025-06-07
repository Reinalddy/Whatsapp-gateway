// app/users/layout.tsx
import { ReactNode } from 'react';
import Sidebar from '@/component/Sidebar';
import ClientWrapper from './ClientWrapper'; // 👇 client component

export default function UsersLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex w-screen bg-gray-100">
            <Sidebar />
            <ClientWrapper>{children}</ClientWrapper>
        </div>
      );
}