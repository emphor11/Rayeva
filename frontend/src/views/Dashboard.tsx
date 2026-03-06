import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { statsApi } from '../services/api';

interface DashboardStats {
    productCount: number;
    proposalCount: number;
    averageLatency: number;
    successRate: number;
    totalInteractions: number;
}

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('spend');
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statsApi.getSummary();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in font-sans pb-24 px-4 overflow-x-hidden">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
                {/* AI Processing Volume */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1a1a1a] rounded-[2.5rem] p-12 text-white min-h-[340px] flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-black/10 transition-transform hover:scale-[1.01]"
                >
                    <div className="relative z-10">
                        <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-4">AI Processing Volume</p>
                        <h2 className="text-[52px] font-bold tracking-tight leading-none">
                            {stats?.productCount.toLocaleString() || '0'}
                        </h2>
                        <p className="text-gray-400 mt-6 text-sm font-medium">Products Categorized Successfully</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold z-10 border-t border-white/5 pt-4">
                        <button className="text-gray-300 hover:text-white transition-colors uppercase tracking-widest">Node Status</button>
                        <span className="text-gray-400 font-mono tracking-widest uppercase">Nodes: 04 / Active</span>
                    </div>

                    {/* Subtle Gradient Glow */}
                    <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent blur-[100px] pointer-events-none" />
                </motion.div>

                {/* AI Reliability Metric */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2.5rem] p-12 border border-gray-100 min-h-[340px] flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="space-y-10">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">AI Decision Reliability</p>
                            <h2 className="text-[52px] font-bold text-gray-900 tracking-tight leading-none">
                                {stats?.successRate || '100'}%
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-5">
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-gray-900 leading-none">
                                        {stats?.proposalCount || '0'}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Proposals Built</span>
                                </div>
                                <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-gray-900 leading-none">
                                        {stats?.averageLatency ? Math.round(stats.averageLatency) : '450'}ms
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Avg Latency</span>
                                </div>
                                <div className="w-12 h-1 bg-blue-400 rounded-full" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Tabs & Detailed Stats Section */}
            <div className="space-y-10 pt-4">
                <div className="bg-[#f4f4f5]/80 p-1.5 rounded-2xl inline-flex items-center border border-gray-200/50 backdrop-blur-sm">
                    <button
                        onClick={() => setActiveTab('spend')}
                        className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${activeTab === 'spend'
                            ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        System Latency
                    </button>
                    <button
                        onClick={() => setActiveTab('merchant')}
                        className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${activeTab === 'merchant'
                            ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Module Distribution
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
