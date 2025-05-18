// app/users/layout.tsx
import type { ReactNode } from 'react'
import Sidebar from '@/component/Sidebar'

export default function UsersLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex w-screen bg-gray-100">
            <Sidebar />
            {children}
        </div>
    )
}