'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    Home,
    MessageSquare,
    // MailWarning,
    // MailQuestion,
    // MailOpenIcon,
    Settings,
    ChevronRight,
    Menu,
    Brain,
    X,
    LogOut,
    Book
} from "lucide-react";
// Sidebar navigation items

interface UserData {
    id: string,
    email: string,
    role: string

}

type SidebarProps = {
    user: UserData;
  };

export default function Sidebar({ user }: SidebarProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathName = usePathname();

    const navigationItems = [
        { name: 'Dashboard', icon: Home, active: pathName == "/user/dashboard" ? true : false, url:'/user/dashboard'},
        // { name: 'Send Messages', icon: MailOpenIcon, active: pathName == "/user/send-messages" ? true : false, url:"/user/send-messages" },
        // { name: 'Failed Messages', icon: MailWarning, active: pathName == "/user/failed-messages" ? true : false, url: "/user/failed-messages" },
        // { name: 'Pending Messages', icon: MailQuestion, active: pathName == "/user/pending-messages" ? true : false, url: "/user/pending-messages" },
        { name: 'Messages', icon: MessageSquare, active: pathName == "/user/all-messages" ? true : false, url: "/user/all-messages" },
        { name: 'Messages With AI', icon: Brain, active: pathName == "/user/send-birthday-messages-with-ai" ? true : false, url: "/user/send-birthday-messages-with-ai" },
        { name: 'Settings', icon: Settings, active: pathName == "/user/settings/whatsapp" ? true : false, url: "/user/settings/whatsapp" },
        { name: 'Api Docs', icon: Book, active: pathName == "/user/settings/api-docs" ? true : false, url: "/user/settings/api-docs" },
        { name: 'Logout', icon: LogOut, active: pathName == "user/logout" ? true : false, url: "/api/logout"}
    ];

    return (
        <div className="sticky top-0 h-screen">
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden fixed top-0 left-0 z-20 p-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="bg-white p-2 rounded-md shadow"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 
                fixed 
                lg:static 
                z-10 
                transition-transform 
                duration-300 
                ease-in-out 
                bg-white 
                shadow 
                h-screen 
                w-64 
                overflow-y-auto
            `}
            >
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-6 border-b">
                <h1 className="text-xl font-bold text-blue-600">Whatsapp Gateway</h1>
            </div>

            {/* Navigation */}
            <nav className="mt-6">
                <div className="px-4 py-2">
                    <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Main</h2>
                </div>
                <div className="px-2 space-y-1">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.url}
                            className={`
                                flex items-center px-4 py-2 text-sm font-medium rounded-md 
                                ${item.active
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }
                            `}
                        >
                            <item.icon className={`mr-3 h-5 w-5 ${item.active ? 'text-blue-500' : 'text-gray-500'}`} />
                            <span>{item.name}</span>
                            {item.active && <ChevronRight className="ml-auto h-4 w-4 text-blue-500" />}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* User Profile */}
            <div className="absolute bottom-0 w-full border-t p-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                            US
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}