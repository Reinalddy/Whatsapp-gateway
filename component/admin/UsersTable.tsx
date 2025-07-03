'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
    Search,
    Edit,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { fetchApi } from '@/helpers/fetchApi';

interface Role {
    id: string,
    name: string
}

interface UserResponse {
    name: string,
    email : string,
    createdAt: string,
    id: number,
    phoneNumber: string,
    status: string,
    role: Role,
    roleId: string
}

interface TableProps {
    onEdit: (user: UserResponse) => void;
    modalStatus: boolean
}

const UsersTable: React.FC<TableProps> = ({ onEdit, modalStatus }) => {
    const [sortField, setSortField] = useState<keyof UserResponse>('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const [users, setUsers] = useState<UserResponse[]>([]);
    const itemsPerPage = 5;

    const fetchUsers = async () => {
        try {
            const userData = await fetchApi('/api/admin/users/get-users', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })

            setUsers(userData.data.users || []);
            // console.log(userData);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [modalStatus]);

    const filteredUsers = useMemo(() => {
        console.log(users);
        return users.filter(user =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const sortedUsers = useMemo(() => {
        return [...filteredUsers].sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredUsers, sortField, sortDirection]);

    const paginateUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedUsers, currentPage]);

    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

    const handleSort = (field: keyof UserResponse) => {
        if (field === sortField) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const SortIcon: React.FC<{ field: keyof UserResponse }> = ({ field }) => {
        if (field !== sortField) return <ChevronUp className="w-4 h-4 opacity-30" />;
        return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <h2 className="text-xl font-semibold text-gray-900">Users</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search Users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {['id', 'Name', 'Email', 'PhoneNumber', 'Role','Status'].map((field) => (
                                <th
                                    key={field}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort(field as keyof UserResponse)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                                        <SortIcon field={field as keyof UserResponse} />
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginateUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{user.id}</td>
                                <td className="px-6 py-4">{user.name}</td>
                                {/* only show 100 characters */}
                                <td className="p-px-11 p-py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.phoneNumber}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role.name === 'admin' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.role.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <button onClick={() => onEdit(user)} className={`text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50}`}>
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    {/* <button onClick={() => onDelete(message.id)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                                        <Trash2 className="w-4 h-4" />
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of {sortedUsers.length} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium">
                                {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersTable;