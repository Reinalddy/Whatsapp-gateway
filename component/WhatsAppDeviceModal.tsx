"use client";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { fetchApi } from "@/helpers/fetchApi";

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

    const handleAddDevice = async () => {
        const res = await fetchApi("/api/whatsapp/device", {
            method: "POST",
            data: JSON.stringify({ deviceName, deviceNumber }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = res;
        // console.log(data);
        // console.log(deviceId);
        // console.log(data.data.id);
        setDeviceId(data.data.id);
        startQrStream(data.data.id);
    };

    const startQrStream = (id: string) => {
        const evtSource = new EventSource(`/api/whatsapp/qr-stream?deviceId=${id}`);
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
                            className="bg-green-600 text-white px-4 py-2 rounded w-full"
                        >
                            Generate QR
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
