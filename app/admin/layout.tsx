// app/users/layout.tsx
'use client';
import { ReactNode, useState } from 'react';
// import Sidebar from '@/component/Sidebar';
import Sidebar from '@/component/admin/Sidebar';
import ClientWrapper from './ClientWrapper';
import {
    Menu,
} from 'lucide-react';

export default function UsersLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // const handleAddUser = () => {
    //     setEditingUser(null);
    //     setModalOpen(true);
    // };
    return (
        <div className="flex h-screen bg-gray-5">
            {/* <Sidebar /> */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className='flex-1 flex flex-col overflow-hidden lg:ml-0'>
                {/* Header */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                >
                    <Menu className="w-5 h-5" />
                </button>
               
                <ClientWrapper>{children}</ClientWrapper>
            </div>
            
        </div>
      );
}