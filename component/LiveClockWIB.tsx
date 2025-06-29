import { useEffect, useState } from "react";

function LiveClockWIB() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
                timeZone: "Asia/Jakarta",
            };
            setTime(now.toLocaleTimeString("id-ID", options));
        };

        updateClock(); // update awal
        const interval = setInterval(updateClock, 1000); // update tiap detik

        return () => clearInterval(interval); // bersihkan saat unmount
    }, []);

    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Message Dashboard</h1>
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Curent Time (WIB):</span>
                <span className="text-sm font-medium">{time}</span>
            </div>
        </div>
    );
}

export default LiveClockWIB;