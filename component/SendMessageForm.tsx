// components/SendMessageForm.tsx
"use client";

import { useState } from "react";

export default function SendMessageForm() {
    const [to, setTo] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/whatsapp/send-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to, message }),
        });

        const data = await res.json();
        setStatus(data.success ? "Berhasil mengirim pesan ✅" : "Gagal mengirim pesan ❌");
    };

    return (
        <form onSubmit={sendMessage} className="max-w-md p-4 border rounded bg-white shadow space-y-4">
            <div>
                <label htmlFor="to" className="block text-sm font-medium text-gray-700">Nomor Tujuan (mis. 628xxxx):</label>
                <input
                    type="text"
                    id="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                    required
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Pesan:</label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                    required
                />
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Kirim Pesan
            </button>

            {status && <p className="text-sm">{status}</p>}
        </form>
    );
}
