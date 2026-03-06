import React from 'react';
import { History, Search, Filter, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { statsApi } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const AILogs: React.FC = () => {
    const [logs, setLogs] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await statsApi.getLogs();
                setLogs(data);
            } catch (error) {
                console.error('Failed to fetch logs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.module?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.promptId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold text-black tracking-tight">AI Interaction Logs</h1>
                <p className="text-gray-600 font-light text-lg">Monitor and audit every decision made by the AI layer.</p>
            </div>

            <div className="card-glass overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gray-50/10">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Filter logs by type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white border border-gray-200 rounded-xl py-2.5 pl-11 pr-6 text-sm text-gray-800 focus:outline-none focus:border-emerald-500/30 w-64 transition-all shadow-sm"
                            />
                        </div>
                        <button className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500 hover:text-black transition-colors bg-white px-4 py-2.5 rounded-xl border border-gray-200 uppercase tracking-widest shadow-sm">
                            <Filter size={14} />
                            <span>Status: All</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                            <Loader2 className="animate-spin" size={32} />
                            <span className="text-xs font-bold uppercase tracking-widest">Fetching Audit Data...</span>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em] bg-gray-50/50">
                                    <th className="px-10 py-5">Interaction Type</th>
                                    <th className="px-10 py-5">Decision Model</th>
                                    <th className="px-10 py-5">Transmission Status</th>
                                    <th className="px-10 py-5">Response Latency</th>
                                    <th className="px-10 py-5 text-right">Occurrence</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredLogs.map((log, i) => (
                                    <motion.tr
                                        key={log.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="text-sm text-gray-600 hover:bg-gray-50/50 transition-colors group cursor-default"
                                    >
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center text-emerald-600 border border-emerald-500/10 transition-transform group-hover:scale-110">
                                                    <History size={18} />
                                                </div>
                                                <span className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{log.module || 'System'}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="font-mono text-[11px] text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                                                gemini-1.5-flash
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]'}`} />
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${log.status === 'SUCCESS' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {log.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-gray-500 font-medium">{log.latencyMs}ms</td>
                                        <td className="px-10 py-6 text-right text-gray-400 text-xs font-light">
                                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-10 text-center border-t border-gray-100 bg-gray-50/10">
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-[0.2em]">
                        Archived Interactions (240+) available in system storage
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AILogs;
