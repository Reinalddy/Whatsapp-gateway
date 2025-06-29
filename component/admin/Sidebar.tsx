import {
    X,
    Home,
    Users,
    MessageSquare,
} from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const pathName = usePathname();
    const menuItems = [
        { icon: <Home className="w-5 h-5" />, label: 'Dashboard', active: pathName == '/admin/dashboard' ? true : false, url: '/admin/dashboard' },
        { icon: <Users className="w-5 h-5" />, label: 'Users', active: pathName == '/admin/users' ? true : false, url: '/admin/users' },
        { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', active: pathName == '/admin/messages' ? true : false, url: '/admin/messages' },
        // { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', active: false },
        // { icon: <Settings className="w-5 h-5" />, label: 'Settings', active: false },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                    fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-200
                `}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="mt-6">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.url}
                            className={`
                                flex items-center px-6 py-3 mx-3 rounded-lg transition-colors duration-200
                                ${item.active
                                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }
                            `}
                        >
                            {item.icon}
                            <span className="ml-3 font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;