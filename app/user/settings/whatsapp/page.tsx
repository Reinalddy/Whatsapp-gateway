'use client'
import WhatsAppDevicesTable from "@/component/WhatsAppDevicesTable";
import WhatsAppDeviceModal from "../../../../component/WhatsAppDeviceModal";
import { useState, useEffect, useRef } from 'react';

// interface ChildProps {
//     refreshTable: () => void;
// }

export default function WhatsAppPage() {

    const [modalOpen, setModalOpen] = useState(false);
    const childRefreshTableFunctionRef = useRef<() => void>(() => {});

    const refreshTable = (fn: () => void) => {
        childRefreshTableFunctionRef.current = fn;
    };

    useEffect(() => {
        // You can add any initialization logic here if needed
        childRefreshTableFunctionRef.current(); // Jalankan function dari child
    }, [modalOpen]);

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
            <WhatsAppDevicesTable registerFunction={refreshTable}></WhatsAppDevicesTable>
        </div>
    );
}
