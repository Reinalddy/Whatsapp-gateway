"use client";
import { useEffect, useState } from "react";
import WhatsAppScanQrModal from "./WhatsAppScanQrModal";

interface WhatsAppDevice {
    id: string;
    name: string;
    phoneNumber: string;
    isActive: boolean;
    createdAt: string;
}

interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}


export default function WhatsAppDevicesTable() {
    const [devices, setDevices] = useState<WhatsAppDevice[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [modalScanOpen, setModalScanOpen] = useState(false);
    const [deviceId, setDeviceId] = useState<string | "">("");
    const limit = 5;

    const fetchDevices = async () => {
        const params = new URLSearchParams({
            search,
            page: page.toString(),
            limit: limit.toString(),
        });

        const res = await fetch(`/api/whatsapp/device-list?${params}`);
        const json = await res.json();

        setDevices(json.data);
        setMeta(json.meta);
    };

    const handleScanQrModalOPen = (deviceId: string) => {
        setModalScanOpen(true);
        setDeviceId(deviceId);
    };

    useEffect(() => {
        fetchDevices();
    }, [page, search]);

    return (
        <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search device..."
                    value={search}
                    onChange={(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                    }}
                    className="border px-4 py-2 rounded-md w-64"
                />
            </div>

            <div className="overflow-x-auto rounded shadow">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left py-2 px-4 border-b">Name</th>
                            <th className="text-left py-2 px-4 border-b">Phone Number</th>
                            <th className="text-left py-2 px-4 border-b">Status</th>
                            <th className="text-left py-2 px-4 border-b">Created At</th>
                            <th className="text-left py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-4">
                                    No devices found.
                                </td>
                            </tr>
                        ) : (
                            devices.map((device) => (
                                <tr key={device.id}>
                                    <td className="py-2 px-4 border-b">{device.name}</td>
                                    <td className="py-2 px-4 border-b">{device.phoneNumber}</td>
                                    <td className="py-2 px-4 border-b">
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${device.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {device.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {new Date(device.createdAt).toLocaleString()}
                                    </td>
                                    <td>
                                        {device.isActive ? <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 mt-2"> Disconect</button> 
                                            : <button className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 h-10 mt-2" onClick={() => handleScanQrModalOPen(device.id)}>Scan</button>}
                                        <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 mt-2"> Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="px-3 py-1">
                        Page {page} of {meta.totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                        disabled={page === meta.totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            <WhatsAppScanQrModal
                open={modalScanOpen}
                onClose={() => setModalScanOpen(false)}
                deviceId={deviceId} // You can pass the device ID here if needed
            />



        </div>
    );
}
