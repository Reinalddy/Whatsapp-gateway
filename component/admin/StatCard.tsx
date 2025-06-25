'use client';
import { CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';

interface MessageStats {
    total: number;
    success: number;
    failed: number;
    pending: number;
}

export default function Statcard({total, success, failed, pending}: MessageStats) {
    // Sample data - replace with your actual data
    const statItems = [
        {
            label: 'Total Messages',
            value: total,
            icon: MessageSquare,
            color: 'text-slate-600',
            bgColor: 'bg-slate-50',
            borderColor: 'border-slate-200'
        },
        {
            label: 'Success',
            value: success,
            icon: CheckCircle,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200'
        },
        {
            label: 'Failed',
            value: failed,
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
        },
        {
            label: 'Pending',
            value: pending,
            icon: Clock,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200'
        }
    ];

    return (
        <div className="max-w-4/1 mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Stats Grid */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <div
                                    key={index}
                                    className={`relative group hover:scale-105 transition-all duration-300 ease-out hover:shadow-lg`}
                                >
                                    <div className={`${item.bgColor} ${item.borderColor} border-2 rounded-xl p-6 h-full`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`${item.bgColor} p-3 rounded-lg border ${item.borderColor}`}>
                                                <IconComponent className={`w-6 h-6 ${item.color}`} />
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-2xl font-bold ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                                                    {item.value}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-gray-600 font-medium text-sm">
                                            {item.label}
                                        </div>

                                        {/* Progress bar for visual representation */}
                                        <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full ${item.color.replace('text-', 'bg-')} transition-all duration-1000 ease-out`}
                                                style={{
                                                    width: `${(item.value / total) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}