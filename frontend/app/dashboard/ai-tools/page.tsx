'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function AIToolsPage() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<{ title?: string; description?: string; keywords?: string[] } | null>(null);

    const handleGenerate = async (type: string) => {
        setLoading(true);
        try {
            // Simulated neural processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            setResults({
                title: 'Accelerating Digital Horizons: The Livatto Protocol',
                description: 'Experience the next generation of automated broadcasting. Our neural-enhanced platform ensures seamless 24/7 transmission with intelligent asset management and a tactile command interface.',
                keywords: ['Autonomous Streaming', 'Neural Metadata', 'Livatto Pro', 'RTMP Bridge', 'Cloud Broadcast']
            });
        } catch (error) {
            console.error('AI Gen failure', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-12 space-y-12 max-w-[1400px] mx-auto animate-fade-in pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tight text-white flex items-center gap-5">
                        <span className="text-4xl p-3 bg-white/5 rounded-2xl border border-white/5">🤖</span>
                        Neural Architect
                    </h1>
                    <p className="text-slate-400 font-bold tracking-tight ml-1">
                        Advanced AI assistance for broadcast metadata and content strategy.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                {/* Input Controller */}
                <div className="xl:col-span-5 space-y-8">
                    <div className="glass-card rounded-[40px] p-8 space-y-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                            Content Matrix
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Raw Content Concept</label>
                                <textarea
                                    rows={5}
                                    placeholder="Describe your broadcast objective or provide raw script fragments..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="glass-input w-full font-medium text-sm resize-none leading-relaxed"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleGenerate('metadata')}
                                    disabled={loading || !prompt}
                                    className="px-6 py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'ANALYZING...' : 'GENERATE TITLE'}
                                </button>
                                <button
                                    onClick={() => handleGenerate('tags')}
                                    disabled={loading || !prompt}
                                    className="px-6 py-5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    GET KEYWORDS
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-[32px] p-6 border-indigo-500/20 bg-indigo-500/5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 animate-pulse">
                                🧠
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Neural Engine Online</p>
                                <p className="text-[9px] font-bold text-indigo-300/60 uppercase tracking-widest">Model: LIVATTO-L-01 (V4.2)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Output Display */}
                <div className="xl:col-span-7 space-y-8">
                    {!results && !loading ? (
                        <div className="glass-card rounded-[48px] p-32 text-center opacity-40 border-dashed">
                            <span className="text-6xl block mb-6 grayscale animate-bounce">📡</span>
                            <p className="text-lg font-black text-white uppercase tracking-widest">Awaiting Transmission</p>
                            <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest">Enter data to begin neural processing</p>
                        </div>
                    ) : (
                        <div className={`space-y-8 transition-all duration-700 ${loading ? 'opacity-30 blur-md scale-95' : 'opacity-100 scale-100'}`}>
                            {/* Suggested Title */}
                            <div className="glass-card rounded-[40px] p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <span className="text-8xl font-black italic">TITLE</span>
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-indigo-500" />
                                    AI Optimized Signal Designation
                                </h3>
                                <p className="text-2xl font-black text-white leading-tight relative z-10">
                                    {results?.title}
                                </p>
                            </div>

                            {/* Description */}
                            <div className="glass-card rounded-[40px] p-8 relative overflow-hidden group">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-indigo-500" />
                                    Suggested Narrative Payload
                                </h3>
                                <p className="text-base text-slate-400 font-bold leading-relaxed relative z-10">
                                    {results?.description}
                                </p>
                                <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                                    <button className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">
                                        COPY TO CLIPBOARD
                                    </button>
                                </div>
                            </div>

                            {/* Keywords */}
                            <div className="glass-card rounded-[40px] p-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-indigo-500" />
                                    Ranked Neural Keywords
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {results?.keywords?.map((kw, i) => (
                                        <span
                                            key={i}
                                            className="px-5 py-2.5 rounded-2xl bg-white/5 text-[10px] font-black text-indigo-300 border border-white/5 hover:border-indigo-500/30 transition-all cursor-default"
                                        >
                                            #{kw.toUpperCase()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
