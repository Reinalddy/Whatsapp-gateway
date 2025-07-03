'use client';
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/component/LoadingSpinner';
import { fetchApi } from '@/helpers/fetchApi';
import Swal from 'sweetalert2';
import UsersTable from '@/component/admin/UsersTable';
import ModalUsers from '@/component/admin/ModalUsers';


interface MessageData {
    content: string;
    createdAt: string;
    deviceId: string;
    id: string;
    notes: string;
    recipient: string;
    sender: string;
    status: string;
    updatedAt: string;
    userId: number;
}

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
    role: Role,
    roleId: string
}

interface UserUpdate {
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
    const [messages, setMessages] = useState<MessageData>({
        content: '',
        createdAt: '',
        deviceId: '',
        id: '',
        notes: '',
        recipient: '',
        sender: '',
        status: '',
        updatedAt: '',
        userId: 0
    });
    const [user, setUsers] = useState<UserResponse>({
        name: '',
        email: '',
        createdAt: '',
        id: 0,
        phoneNumber: '',
        status: '',
        role: {
            id: '',
            name: ''
        },
        roleId: ''
    });

    const handleUsersEdit = (user: UserResponse) => {
        setUsers(user);
        setModalOpen(true);
        console.log(user);
    };

    const handleUpdateUsers = async (user: UserUpdate) => {
        console.log(user);
        setLoading(true);
        // HANDLE RESEND MESSAGE
        try {
            // const res = await fetchApi('/api/admin/whatsapp/resend-message', {
            //     method: 'POST', headers: { 'Content-Type': 'application/json' }, data: {
            //         phoneNumber: message.recipient,
            //         deviceId: message.deviceId,
            //         message: message.content
            //     }
            // });

            // if (res.code == 200) {
            //     Swal.fire({
            //         icon: 'success',
            //         title: 'Success',
            //         text: res.message
            //     })
            // } else {
            //     Swal.fire({
            //         icon: 'error',
            //         title: 'Failed',
            //         text: res.message
            //     })
            // }
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