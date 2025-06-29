'use client';
import React, { useState, useEffect } from 'react';
import Modal from '@/component/admin/Modal';
import LoadingSpinner from '@/component/LoadingSpinner';
import { fetchApi } from '@/helpers/fetchApi';
import Swal from 'sweetalert2';
import UsersTable from '@/component/admin/UsersTable';


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

    const handleResendMessage = (message: MessageData) => {
        console.log(message);
        setModalOpen(true);
        setMessages(message);
    };

    const handleResendMessageSend = async (message: MessageData) => {
        console.log(message);
        setLoading(true);
        // HANDLE RESEND MESSAGE
        try {
            const res = await fetchApi('/api/admin/whatsapp/resend-message', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, data: {
                    phoneNumber: message.recipient,
                    deviceId: message.deviceId,
                    message: message.content
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
                    onEdit={handleResendMessage}
                />
            </main>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                message={messages}
                onSave={handleResendMessageSend}
            />


        </>
    );
};

export default AdminUsers;