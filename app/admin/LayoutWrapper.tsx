'use client';

import { ReactNode, useState } from 'react';
import { Menu } from 'lucide-react'; // contoh icon
import Sidebar from '@/component/admin/Sidebar';
import ClientWrapper from './ClientWrapper';

interface LayoutWrapperProps {
    user: any; // ganti ke tipe User jika ada
    children: ReactNode;
}

export default function LayoutWrapper({ user, children }: LayoutWrapperProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-5">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
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
