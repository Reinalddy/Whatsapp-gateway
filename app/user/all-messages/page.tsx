'use client'

import { useEffect, useState } from 'react';
import { fetchApi } from '@/helpers/fetchApi';
import SendMessageModal from "@/component/SendMessageModal"

type WhatsAppMessage = {
    id: number;
    content: string;
    sender: string;
    recipient: string;
    status: string;
    createdAt: string;
};

export default function AllMessagesPage() {
    const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState('');
    const [modal, setModalOpen] = useState(false);

    const limit = 5;

    const fetchMessages = async () => {
        const res = await fetchApi(`/api/whatsapp/message-list?search=${search}&page=${page}&limit=${limit}&status=${status}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = res.data[0];
        setMessages(data.messages);
        setTotalPages(data.totalPages);
      };


    useEffect(() => {
        fetchMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1); // reset to page 1 when search is submitted
        fetchMessages();
      };
    

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-4">WhatsApp Messages</h1>
            <div className="mb-4">
                <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Send New Message
                </button>
            </div>
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Search messages..."
                    className="border rounded-lg px-3 py-2 text-sm w-full max-w-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                
                
                <select
                    name="status"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="success">Success</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                    Search
                </button>
            </form>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Content</th>
                            <th className="p-2 border">Sender</th>
                            <th className="p-2 border">Recipient</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map((msg) => (
                            <tr key={msg.id} className="border-t">
                                <td className="p-2 border">{msg.content}</td>
                                <td className="p-2 border">{msg.sender}</td>
                                <td className="p-2 border">{msg.recipient}</td>
                                <td className="p-2 border">{msg.status}</td>
                                <td className="p-2 border">{new Date(msg.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        {messages.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center p-4">No messages found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <SendMessageModal open={modal} onClose={() => setModalOpen(false)}></SendMessageModal>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4 items-center">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm">
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}