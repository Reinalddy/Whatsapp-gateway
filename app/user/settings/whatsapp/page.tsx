'use client'
import WhatsAppDevicesTable from "@/component/WhatsAppDevicesTable";
import WhatsAppDeviceModal from "../../../../component/WhatsAppDeviceModal";
import { useState, useEffect } from 'react';

export default function WhatsAppPage() {
    // return (
    //     <main className="p-8">
    //         <h1 className="text-xl font-bold mb-4">Koneksi WhatsApp</h1>
    //         <WhatsAppQR deviceId="my-device-id" />
    //     </main>
    // );

    const [modalOpen, setModalOpen] = useState(false);
    // Apply sorting and filtering

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Device Management</h2>
            {/* add device modal */}
            <div className="mb-4">
                <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Add Device
                </button>
            </div>
            <WhatsAppDeviceModal open={modalOpen} onClose={() => setModalOpen(false)} />

            {/* Table */}
            <WhatsAppDevicesTable></WhatsAppDevicesTable>
        </div>
    );
}
