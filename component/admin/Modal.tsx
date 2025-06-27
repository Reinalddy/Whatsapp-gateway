'use client';
import React, { useState } from 'react';
import {
    X,
} from 'lucide-react';

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

const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    message: MessageData | null;
    onSave: (message: MessageData) => void;
}> = ({ isOpen, onClose, message, onSave }) => {
    const [formData, setFormData] = useState<MessageData>({
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

    React.useEffect(() => {
        if (message) {
            setFormData(message);
        } else {
            setFormData({
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
        }
    }, [message]);

    const handleSubmit = () => {
        if (!formData.userId || !formData.deviceId) return;
        const messageData: MessageData = {
            content: formData.content,
            createdAt: formData.createdAt,
            deviceId: formData.deviceId,
            id: formData.deviceId,
            notes: formData.notes,
            recipient: formData.recipient,
            sender: formData.sender,
            status: formData.status,
            updatedAt: formData.updatedAt,
            userId: formData.userId
        };
        onSave(messageData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Resend Message
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">DeviceID</label>
                        <input
                            type="text"
                            value={formData.deviceId}
                            // onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            readOnly
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                        <input
                            type="text"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
                        <input
                            type="text"
                            value={formData.recipient}
                            // onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            readOnly
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sender</label>
                        <input
                            type="text"
                            value={formData.sender}
                            // onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            readOnly
                        />
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
                            Resend Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;