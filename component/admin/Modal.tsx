'use client';
import React, { useState } from 'react';
import {
    X,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    joinDate: string;
}

const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSave: (user: User) => void;
}> = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        email: '',
        role: 'User',
        status: 'active'
    });

    React.useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'User',
                status: 'active'
            });
        }
    }, [user]);

    const handleSubmit = () => {
        if (!formData.name || !formData.email) return;
        const userData: User = {
            id: user?.id || Date.now(),
            name: formData.name || '',
            email: formData.email || '',
            role: formData.role || 'User',
            status: formData.status as 'active' | 'inactive' || 'active',
            joinDate: user?.joinDate || new Date().toISOString().split('T')[0]
        };
        onSave(userData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {user ? 'Edit User' : 'Add New User'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="User">User</option>
                            <option value="Moderator">Moderator</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            {user ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;