'use client';
import React, { useState } from 'react';
import LoadingSpinner from '@/component/LoadingSpinner';
import { fetchApi } from '@/helpers/fetchApi';
import Swal from 'sweetalert2';
import UsersTable from '@/component/admin/UsersTable';
import ModalUsers from '@/component/admin/ModalUsers';

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
    id: number,
    name: string,
    email: string,
    phoneNumber: string,
    status: string,
    roleId: string
}
// Main Dashboard Component
const AdminUsers: React.FC = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUsers] = useState<UserResponse>({
        name: '',
        email: '',
        createdAt: '',
        id: 0,
        phoneNumber: '',
        status: '',
        roleId: ''
    });

    const handleUsersEdit = (user: UserResponse) => {
        setUsers(user);
        setModalOpen(true);
    };

    const handleUpdateUsers = async (user: UserUpdate) => {
        setLoading(true);
        // HANDLE RESEND MESSAGE
        try {
            const res = await fetchApi('/api/admin/users/edit-users', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, data: {
                    id: user.id,
                    status: user.status,
                    role: user.roleId,
                    name: user.name,
                    email: user.email
                }
            });

            if (res.code == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: res.message
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: res.message
                })
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Something went wrong'
            });
        }
    };

    // useEffect(() => {
    //     getMessageStatisTic()
    // }, [])

    return (
        <>
            {/* Main Content */}
            {loading && <LoadingSpinner />}
            <main className="flex-1 overflow-y-auto p-6">
                {/* <StatCard
                    total={messageStatistic.all}
                    success={messageStatistic.success}
                    failed={messageStatistic.failed}
                    pending={messageStatistic.pending}
                /> */}

                {/* Table */}
                <UsersTable
                    modalStatus={modalOpen}
                    onEdit={handleUsersEdit}
                />
            </main>

            {/* Modal */}
            <ModalUsers
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                user={user}
                onSave={handleUpdateUsers}
            />


        </>
    );
};

export default AdminUsers;