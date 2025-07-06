'use client';
import React, { useState } from 'react';
import {
    X,
} from 'lucide-react';
import { fetchApi } from '@/helpers/fetchApi';

interface Role {
    id: string,
    name: string
}

interface UserResponse {
    name: string,
    email: string,
    createdAt: string,
    id: number,
    phoneNumber: string,
    status: string,
    roleId: string
}

interface UserUpdate {
    id : number,
    name: string,
    email: string,
    phoneNumber: string,
    status: string,
    roleId: string
}


const ModalUsers: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    user: UserResponse | null;
    onSave: (user: UserUpdate) => void;
}> = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState<UserUpdate>({
        id: 0,
        name: '',
        email: '',
        phoneNumber: '',
        status: '',
        roleId: ''
    });

    const [roleList, setRoleList] = useState<Role[]>([]);

    React.useEffect(() => {
        const getRoleList = async () => {
            const res = await fetchApi('/api/admin/get-role-list', {
                method: 'GET',
            });

            if (res.code == 200) {
                setRoleList(res.data);
            }
        }

        getRoleList();
        if (user) {
            setFormData(user);
        } else {
            setFormData({
                id: 0,
                name: '',
                email: '',
                phoneNumber: '',
                status: '',
                roleId: ''
            });
        }
    }, [user]);

    const handleSubmit = () => {
        if (!formData.name || !formData.email) return;
        const userData: UserUpdate = {
            id: formData.id,
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            status: formData.status,
            roleId: formData.roleId
        };
        onSave(userData);
        onClose();
    };

    const handleChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, roleId: e.target.value });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Update User
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
                            // onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="text"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            name="status"
                            id="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-40 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select name="role" id="role" onChange={handleChangeRole} className='bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-40 dark:focus:ring-blue-500 dark:focus:border-blue-500' required>
                            {roleList.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
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
                            Edit User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalUsers;