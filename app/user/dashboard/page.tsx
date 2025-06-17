'use client'
import { useState, useEffect } from "react";
import LiveClockWIB from "@/component/LiveClockWIB";
import {
    Activity,
    Send,
    Clock,
    AlertCircle,
    BarChart2,
} from "lucide-react";
import { fetchApi } from "@/helpers/fetchApi";

// Mock data
const initialData = {
    total: 1247,
    sent: 982,
    pending: 189,
    failed: 76,
    dailyLimit: 1500,
    sentToday: 756
};

export default function MessageDashboard() {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [totalFailedMessages, setTotalFailedMessages] = useState(0);
    const [totalSentMessages, setTotalSentMessages] = useState(0);
    const [totalPendingMessages, setTotalPendingMessages] = useState(0);
    const [totalMessages, setTotalMessages] = useState(0);
    const [dailyLimit, setDailyLimit] = useState(0);

    // Simulate data loading
    useEffect(() => {
        // const timer = setTimeout(() => {
        //     setLoading(false);
        // }, 1000);

        // return () => clearTimeout(timer);
        const getDashboardData = async () => {
            setLoading(true);
            const res = await fetchApi(`/api/whatsapp/get-messages-count`, {
                method: "GET",
            });

            console.log(res.data);
            setTotalFailedMessages(res.data.failed);
            setTotalSentMessages(res.data.success);
            setTotalPendingMessages(res.data.pending);
            setTotalMessages(res.data.all);
            setDailyLimit(res.data.dailyLimit);
            setLoading(false);
            console.log(dailyLimit);
        }

        getDashboardData();

    }, []);

    // Calculate percentage of daily limit used
    const limitPercentage = (totalMessages / dailyLimit) * 100;
    const limitColorClass =
        limitPercentage > 90 ? "bg-red-500" :
            limitPercentage > 70 ? "bg-amber-500" :
                "bg-green-500";

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 h-screen overflow-auto">
            {/* Main Content */}
            <div className="p-6">
                <LiveClockWIB />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Messages */}
                    <div className="bg-white p-4 rounded-md shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">Total Messages</span>
                            <Activity className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="mt-2">
                            <span className="text-3xl font-bold text-gray-800">{totalMessages}</span>
                        </div>
                    </div>

                    {/* Sent Messages */}
                    <div className="bg-white p-4 rounded-md shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">Sent</span>
                            <Send className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="mt-2">
                            <span className="text-3xl font-bold text-gray-800">{totalSentMessages}</span>
                        </div>
                    </div>

                    {/* Pending Messages */}
                    <div className="bg-white p-4 rounded-md shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">Pending</span>
                            <Clock className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="mt-2">
                            <span className="text-3xl font-bold text-gray-800">{totalPendingMessages}</span>
                        </div>
                    </div>

                    {/* Failed Messages */}
                    <div className="bg-white p-4 rounded-md shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">Failed</span>
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="mt-2">
                            <span className="text-3xl font-bold text-gray-800">{totalFailedMessages}</span>
                        </div>
                    </div>
                </div>

                {/* Daily Limit */}
                <div className="bg-white p-4 rounded-md shadow mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Daily Limit</span>
                        <span className="text-sm font-medium">
                            {dailyLimit}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                            className={`h-2.5 rounded-full ${limitColorClass}`}
                            style={{ width: `${Math.min(limitPercentage, 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Message Status Chart */}
                <div className="bg-white p-4 rounded-md shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-800">Message Status</h2>
                        <BarChart2 className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex h-40 items-end justify-around">
                        <div className="flex flex-col items-center">
                            <div className="bg-green-500 w-16 rounded-t-md border-black" style={{ height: `${(totalSentMessages / totalMessages) * 100}px` }}></div>
                            <span className="mt-2 text-sm text-gray-600">Sent</span>
                            <span className="text-xs font-medium">{((totalSentMessages / totalMessages) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-amber-500 w-16 rounded-t-md" style={{ height: `${(totalPendingMessages / totalSentMessages) * 100}px` }}></div>
                            <span className="mt-2 text-sm text-gray-600">Pending</span>
                            <span className="text-xs font-medium">{((totalPendingMessages / totalSentMessages) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-red-500 w-16 rounded-t-md" style={{ height: `${(totalFailedMessages / totalSentMessages) * 100}px` }}></div>
                            <span className="mt-2 text-sm text-gray-600">Failed</span>
                            <span className="text-xs font-medium">{((totalFailedMessages / totalSentMessages) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}