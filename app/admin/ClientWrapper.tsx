'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/lib/store/userStore';
import { getUserFromToken } from '@/lib/authentication/getUserFromToken';
import { useRouter } from 'next/navigation';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const { user, setUser, clearUser } = useUserStore();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            if (!user) {
                const u = await getUserFromToken();
                if (u) {
                    setUser(u);
                } else {
                    clearUser();
                    router.push('/login'); // redirect jika tidak ada user
                }
            }
        };
        fetchUser();
    }, []);

    if (!user) {
        return <div className="p-4">Loading or unauthorized...</div>;
    }

    if(user.role != "admin") {
        return <div className="p-4">You are not admin</div>;
    }

    return <>{children}</>;
}