import React, { useState } from 'react';
import { productApi } from '../services/api';
import { Tag, Loader2, CheckCircle2, AlertCircle, Sparkles, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductAI: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await productApi.categorize(title, description);
            setResult(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to categorize product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold text-black tracking-tight">Product AI Categorizer</h1>
                <p className="text-slate-500 font-light text-lg">Automate your catalog management with sustainable intelligence.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                {/* Form Section */}
                <div className="card-glass p-10 space-y-8">
                    <div className="flex items-center gap-3 text-emerald-500 pb-4 border-b border-white/5">
                        <Box size={24} />
                        <h3 className="text-xl font-bold text-black">Product Details</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Product Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Organic Cotton Tote Bag"
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Specification / Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the product materials, origin, and sustainability features..."
                                className="input-field min-h-[160px] resize-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all ${loading
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/20'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>AI Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    <span>Run Categorization</span>
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
                                    <Tag size={40} className="opacity-20" />
                                </div>
                                <h4 className="text-black font-semibold mb-2">Catalog Intelligence Unit</h4>
                                <p className="max-w-xs text-sm font-light text-slate-500">Enter product details to initiate the specialist AI engine for strategic categorization and SEO metadata.</p>
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
                                    <h3 className="text-black font-bold text-xl">AI Catalog Analysis</h3>
                                    <p className="text-slate-500 text-sm mt-2 font-light">Executing specialist intelligence...</p>
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
                                <h3 className="text-black font-bold text-lg mb-2">Analysis Interrupted</h3>
                                <p className="text-slate-500 text-sm max-w-xs font-light">{error}</p>
                                <button onClick={() => setError(null)} className="mt-6 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-black transition-colors">Dismiss</button>
                            </motion.div>
                        )}

                        {result && !loading && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="card-glass p-10 border-emerald-500/10 space-y-8 overflow-hidden relative"
                            >
                                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                    <div className="flex items-center gap-3 text-emerald-700 font-bold">
                                        <CheckCircle2 size={24} />
                                        <span className="text-lg">Catalog Metadata Generated</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Primary Category</p>
                                        <p className="text-black font-bold text-xl">{result.primaryCategory}</p>
                                    </div>
                                    <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sub Category</p>
                                        <p className="text-black font-bold text-xl">{result.subCategory}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Strategic SEO Metadata</p>
                                    <div className="flex flex-wrap gap-2">
                                        {result.seoTags?.map((tag: string, i: number) => (
                                            <span key={i} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-600 hover:border-emerald-500/30 hover:text-black transition-all cursor-default">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Sustainability Filters</p>
                                    <div className="flex flex-wrap gap-2">
                                        {result.sustainabilityFilters?.map((filter: string, i: number) => (
                                            <span key={i} className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-bold tracking-tight">
                                                {filter}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="absolute -right-8 -bottom-8 w-40 h-40 blur-[80px] rounded-full bg-emerald-500/10 pointer-events-none" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProductAI;
