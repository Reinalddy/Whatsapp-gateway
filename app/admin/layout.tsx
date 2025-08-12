import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
// import { getUserFromToken } from '@/lib/auth';
import LayoutWrapper from './LayoutWrapper';
import { getUserFromToken } from '@/lib/authentication/getUserFromToken';

export default async function UsersLayout({ children }: { children: ReactNode }) {
    const userData = await getUserFromToken();
    // if(!userData) return <div className="p-4">Loading or unauthorized...</div>

    // if(userData.role != "admin") {
    //    notFound();
        
    // }
    return <LayoutWrapper user={userData}>{children}</LayoutWrapper>;
}