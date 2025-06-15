"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/helpers/fetchApi";
import Swal from "sweetalert2";

interface Props {
    open: boolean;
    onClose: () => void;
}

interface WhatsAppDevice {
    id: string;
    name: string;
    phoneNumber: string;
    isActive: boolean;
    createdAt: string;
}

export default function AiMessageModal({ open, onClose }: Props) {

    const [to, setTo] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");
    const [device, setDevice] = useState<WhatsAppDevice[]>([]);
    const [deviceId, setDeviceId] = useState("");
    const [loading, setloading] = useState(false);

    const sendMessage = async (e: React.FormEvent) => {
        setloading(true);
        e.preventDefault();

        const res = await fetchApi("/api/whatsapp/send-message-ai-birthday", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data: {
                deviceId: deviceId,
                phoneNumber: to,
                gender: gender,
                birthdayDate: age,
                usersName: name
            },
        });

        setloading(false);
        if (res.code == 200) {
            await Swal.fire({
                icon: "success",
                title: "Success Send Messages!",
                text: res.message,
            });
            onClose()
        } else {
            await Swal.fire({
                icon: "error",
                title: "Failed",
                text: res.message || "Something went wrong.",
            });
            setStatus("Failed Send Message ❌")
        }
    };

    useEffect(() => {
        const getAllDeviceMember = async () => {
            const deviceMember = await fetchApi("/api/whatsapp/get-device-member", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (deviceMember.code == 200) {
                setDevice(deviceMember.data)
            }
        }

        getAllDeviceMember()

        if (!open) {

        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-[90%] max-w-md space-y-4">
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
                        <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                            Select Device
                        </label>
                        <select
                            id="to"
                            name="to"
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            defaultValue=""
                            onChange={(e) => setDeviceId(e.target.value)}
                        >
                            <option value="" disabled>
                                {device.length === 0 ? "No data" : "Select a device"}
                            </option>
                            {device.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Users Name</label>
                        <input type="text" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                    </div>

                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <select name="gender" id="gender" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                        <input type="text" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
                    </div>

                    <button
                        className="px-4 py-2 mr-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Loading...</span>
                            </div>
                        ) : (
                            "Send Message"
                        )}
                    </button>

                    {status && <p className="text-sm">{status}</p>}
                </form>
                <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => onClose()}>Cancel</button>
            </div>
        </div>
    );
}
