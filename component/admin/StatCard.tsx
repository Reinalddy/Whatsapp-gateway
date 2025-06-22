import {
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
interface StatCard {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCard> = ({ title, value, change, trend, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
            <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{change}</span>
            </div>
        </div>
    </div>
);

export default StatCard;