"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { fetchApi } from "@/helpers/fetchApi";

interface Props {
    open: boolean;
    onClose: () => void;
    deviceId?: string;
}

export default function WhatsAppScanQrModal({ open, onClose, deviceId }: Props) {
    const [qr, setQr] = useState("");
    const [connected, setConnected] = useState(false);


    useEffect(() => {
        if (open && deviceId) {
            // Simulasi fetch QR Code
            const startQrStream = () => {
                const evtSource = new EventSource(`/api/whatsapp/qr-stream?deviceId=${deviceId}`);
                evtSource.onmessage = (e) => {
                    const data = JSON.parse(e.data);
                    if (data.qr) setQr(data.qr);
                    if (data.connected) {
                        setConnected(true);
                        evtSource.close();
                        setTimeout(() => {
                            onClose();
                        }, 1500);
                    }
                };
            };

            startQrStream();
        }
    }, [open, onClose, deviceId]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-4 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Scan WhatsApp QR Code
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex justify-center items-center min-h-[200px]">
                    {qr ? (
                        <div className="flex flex-col items-center space-y-4">
                            {connected ? (
                                <div className="text-green-500 text-lg">✅ Connected successfully</div>
                            ) : <QRCode value={qr} size={300} />
                            
                            }
                            
                        </div>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-300 text-center">
                            Loading QR Code...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
