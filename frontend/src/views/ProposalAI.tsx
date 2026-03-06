import React, { useState } from 'react';
import { proposalApi } from '../services/api';
import { FileText, Loader2, CheckCircle2, AlertCircle, DollarSign, Leaf, Sparkles, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProposalAI: React.FC = () => {
    const [customerName, setCustomerName] = useState('');
    const [budgetLimit, setBudgetLimit] = useState('');
    const [preferences, setPreferences] = useState<string[]>(['Sustainable material']);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [showJson, setShowJson] = useState(false);

    const sustainabilityOptions = [
        'FSC Certified',
        'Recycled Content',
        'Solar Powered',
        'Biodegradable',
        'Plastic-free',
        'Sustainable material',
        'Energy Efficient'
    ];

    const togglePreference = (pref: string) => {
        setPreferences(prev =>
            prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!budgetLimit) return;

        if (preferences.length === 0) {
            setError('Please select at least one sustainability goal.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await proposalApi.generate({
                customerName: customerName || 'Valued Partner',
                budgetLimit: parseFloat(budgetLimit),
                sustainabilityPreferences: preferences
            });
            setResult(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to generate proposal. Please ensure your budget is sufficient for the selected preferences.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold text-black tracking-tight">B2B Proposal Builder</h1>
                <p className="text-slate-500 font-light text-lg">Combine budget discipline with AI-assisted sustainability reasoning.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
                {/* Form Section */}
                <div className="card-glass p-10 space-y-8">
                    <div className="flex items-center gap-3 text-emerald-500 pb-4 border-b border-white/5">
                        <Building2 size={24} />
                        <h3 className="text-xl font-bold text-black">Proposal Parameters</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Client / Project Name</label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="e.g., GreenTech Solutions"
                                className="input-field"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Budget Allocation ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-0.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="number"
                                    value={budgetLimit}
                                    onChange={(e) => setBudgetLimit(e.target.value)}
                                    placeholder="1000"
                                    className="input-field pl-11"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Priority Sustainability Goals</label>
                            <div className="flex flex-wrap gap-2.5">
                                {sustainabilityOptions.map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => togglePreference(opt)}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${preferences.includes(opt)
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                                            : 'bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all ${loading
                                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/20'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    <span>Generate AI Proposal</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Result Section */}
                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {!result && !loading && !error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center p-12 text-slate-600"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center mb-6">
                                    <FileText size={40} className="opacity-20" />
                                </div>
                                <h4 className="text-black font-semibold mb-2">Build Proposal</h4>
                                <p className="max-w-xs text-sm font-light text-slate-600">Set your budget and sustainability preferences. The AI will select the best product mix and curate the impact reasoning.</p>
                            </motion.div>
                        )}

                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="h-full card-glass p-12 flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
                                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500" size={28} />
                                </div>
                                <div>
                                    <h3 className="text-black font-bold text-xl">Building Smart Mix</h3>
                                    <p className="text-slate-500 text-sm mt-2 font-light">Optimizing product selection...</p>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card-glass p-10 border-red-500/20 flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                    <AlertCircle className="text-red-500" size={32} />
                                </div>
                                <h3 className="text-black font-bold text-lg mb-2">Generation Interrupted</h3>
                                <p className="text-slate-500 text-sm max-w-xs font-light">{error}</p>
                                <button onClick={() => setError(null)} className="mt-6 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-black transition-colors">Dismiss</button>
                            </motion.div>
                        )}

                        {result && !loading && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card-glass p-10 border-emerald-500/10 space-y-8 flex flex-col h-full overflow-hidden relative"
                            >
                                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                                    <div className="flex items-center gap-3 text-emerald-600 font-bold">
                                        <CheckCircle2 size={24} />
                                        <span className="text-lg">AI Proposal Ready</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setShowJson(!showJson)}
                                            className="text-[10px] font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors"
                                        >
                                            {showJson ? 'Back to View' : 'View JSON'}
                                        </button>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Budget Utilization</p>
                                            <p className="text-black font-bold text-2xl tracking-tight">${result.budgetUtilization.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {showJson ? (
                                        <motion.div
                                            key="json"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex-1 overflow-auto bg-gray-900 rounded-2xl p-6 relative group"
                                        >
                                            <pre className="text-[10px] text-emerald-400 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                                                {JSON.stringify(result, null, 2)}
                                            </pre>
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[9px] text-gray-500 font-mono">RAW_PAYLOAD_V1.1</span>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="visual"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="space-y-8 flex-1 flex flex-col min-h-0"
                                        >
                                            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Curated Product Mix</p>
                                                <div className="space-y-4">
                                                    {result.productMix?.map((item: any, i: number) => (
                                                        <div key={i} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 hover:border-emerald-500/20 hover:bg-white transition-all group shadow-sm">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <h4 className="text-gray-900 font-bold">{item.productName}</h4>
                                                                <span className="text-[10px] bg-emerald-100/50 px-2.5 py-1 rounded-lg text-emerald-700 font-bold border border-emerald-200 uppercase">Qty: {item.quantity}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-600 leading-relaxed font-light italic group-hover:text-gray-900">
                                                                "{item.reasoning}"
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Financial Breakdown */}
                                            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 space-y-3">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                                    <span className="text-gray-900 font-bold">${result.costBreakdown.subtotal.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-emerald-600 font-medium">Eco-Savings / Credits</span>
                                                    <span className="text-emerald-700 font-bold">-${result.costBreakdown.savings.toLocaleString()}</span>
                                                </div>
                                                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Net Budget Impact</span>
                                                    <span className="text-xl font-black text-gray-900">${result.budgetUtilization.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                                <div className="flex items-center gap-3 text-emerald-600">
                                                    <Leaf size={18} />
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Impact Strategy Positioning</p>
                                                </div>
                                                <div className="text-sm text-gray-800 leading-relaxed bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100/50 font-light shadow-inner">
                                                    {result.impactSummary}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="absolute -right-12 -top-12 w-48 h-48 blur-[100px] rounded-full bg-emerald-500/5 pointer-events-none" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProposalAI;
