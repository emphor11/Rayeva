import React from 'react';
import {
    LayoutDashboard,
    Tag,
    FileText,
    History,
} from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'product-ai', label: 'Product AI', icon: Tag },
        { id: 'proposal-ai', label: 'Proposal AI', icon: FileText },
        { id: 'logs', label: 'AI Logs', icon: History },
    ];

    return (
        <div className="w-60 bg-white h-screen flex flex-col border-r border-gray-100 sticky top-0 px-3 py-6 font-sans">
            {/* Top Logo & Profile Section */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="w-3.5 h-3.5 border-2 border-white rounded-full" />
                    </div>
                    <span className="font-bold text-[17px] text-gray-900 tracking-tight">Acme</span>
                </div>

                <div className="flex items-center gap-1.5 p-1 px-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                    <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden border border-blue-100">
                        <span className="text-[10px]">🐧</span>
                    </div>
                </div>
            </div>

            {/* Bold Separator */}
            <div className="h-0.5 bg-gray-900 mb-12 mx-2 rounded-full opacity-90" />

            {/* Navigation Menu */}
            <nav className="flex-1 flex flex-col gap-3">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border ${isActive
                                ? 'bg-white border-gray-900 text-gray-900 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]'
                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-900 hover:text-gray-900 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                                }`}
                        >
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'} />
                            <span className="text-sm tracking-tight">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Status Section */}
            <div className="mt-auto pt-4 border-t border-gray-50">
                <div className="px-3 py-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">System Status</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">All AI nodes active</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
