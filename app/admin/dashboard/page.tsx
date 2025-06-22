'use client';
import React, { use, useState, useEffect } from 'react';
import StatCard from '@/component/admin/StatCard';
import Modal from '@/component/admin/Modal';
import Table from '@/component/admin/Table';
import {
    Users,
    MessageSquare,
    MailOpen,
    MailWarning
} from 'lucide-react';
import { fetchApi } from '@/helpers/fetchApi';

// Types
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    joinDate: string;
}

// Sample data
const sampleUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', joinDate: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'inactive', joinDate: '2024-03-10' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Moderator', status: 'active', joinDate: '2024-01-05' },
    { id: 5, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'active', joinDate: '2024-04-12' },
    { id: 6, name: 'Emily Davis', email: 'emily@example.com', role: 'User', status: 'inactive', joinDate: '2024-02-28' },
    { id: 7, name: 'Chris Wilson', email: 'chris@example.com', role: 'Admin', status: 'active', joinDate: '2024-03-15' },
    { id: 8, name: 'Lisa Anderson', email: 'lisa@example.com', role: 'User', status: 'active', joinDate: '2024-04-01' },
];

const statsData = [
    {
        title: 'Total Users',
        value: '2,543',
        change: '+12.5%',
        trend: 'up',
        icon: <Users className="w-6 h-6" />
    },
    {
        title: 'Total Messages',
        value: '18,293',
        change: '+8.2%',
        trend: 'up',
        icon: <MessageSquare className="w-6 h-6" />
    },
    {
        title: 'Sent Messages',
        value: '10,000',
        change: '-3.1%',
        trend: 'down',
        icon: <MailOpen className="w-6 h-6" />
    },
    {
        title: 'Failed Messages',
        value: '200',
        change: '+15.3%',
        trend: 'up',
        icon: <MailWarning className="w-6 h-6" />
    }
];

// Main Dashboard Component
const AdminDashboard: React.FC = () => {
    
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(sampleUsers);
    const [messageStatistic, setMessageStatistic] = useState([]);

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    const getMessageStatisTic = async () => {
        const dataStatisTic = await fetchApi('/api/admin/whatsapp/get-all-statistic-message', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        setMessageStatistic(dataStatisTic.data);
    }

    const handleSaveUser = (userData: User) => {
        if (editingUser) {
            setUsers(users.map(u => u.id === userData.id ? userData : u));
        } else {
            setUsers([...users, userData]);
        }
    };

    const handleDeleteUser = (id: number) => {
        setUsers(users.filter(u => u.id !== id));
    };

    useEffect(() => {
        getMessageStatisTic()
    }, [])

    return (
        <>
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard key= {...stat} />
                    {/* {messageStatistic.map((stat, index) => (
                    ))} */}
                </div>

                {/* Table */}
                <Table
                    // users={users}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                />
            </main>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                user={editingUser}
                onSave={handleSaveUser}
            />
            

        </>
    );
};

export default AdminDashboard;