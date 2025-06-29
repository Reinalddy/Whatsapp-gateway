"use client";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { fetchApi } from "@/helpers/fetchApi";
import { toast } from "react-hot-toast";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function WhatsAppDeviceModal({ open, onClose }: Props) {
    const [deviceName, setDeviceName] = useState("");
    const [deviceNumber, setDeviceNumber] = useState("");
    const [qr, setQr] = useState("");
    const [connected, setConnected] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddDevice = async () => {
        setLoading(true);
        const res = await fetchApi("/api/whatsapp/device", {
            method: "POST",
            data: JSON.stringify({ deviceName, deviceNumber }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        setLoading(false);
        const data = res;
        // console.log(data);
        // console.log(deviceId);
        // console.log(data.data.id);
        if(data.code == 200) {
            toast.success("Device created successfully");
            setDeviceId(data.data.id);
        }
        onClose();
    };

    useEffect(() => {
        if (!open) {
            setDeviceName("");
            setDeviceNumber("");
            setQr("");
            setConnected(false);
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-[90%] max-w-md space-y-4">
                {!qr ? (
                    <>
                        <input
                            placeholder="Device Name"
                            className="w-full border p-2"
                            value={deviceName}
                            onChange={(e) => setDeviceName(e.target.value)}
                        />
                        <input
                            placeholder="Device Number"
                            className="w-full border p-2"
                            value={deviceNumber}
                            onChange={(e) => setDeviceNumber(e.target.value)}
                        />
                        <button
                            onClick={handleAddDevice}
                            className="px-4 py-2 mr-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Loading...</span>
                                </div>
                            ) : (
                                "Add Device"
                            )}
                        </button>
                    </>
                ) : (
                    <div className="text-center">
                        {connected ? (
                            <div className="text-green-500 text-lg">✅ Connected successfully</div>
                        ) : (
                            <>
                                <p className="mb-2">Scan this QR code with WhatsApp</p>
                                <QRCode value={qr} size={200} />
                            </>
                        )}
                    </div>
                )}
                <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => onClose()}>Cancel</button>
            </div>
        </div>
    );
}
