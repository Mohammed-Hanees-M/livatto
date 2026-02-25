'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const metrics = [
        { label: 'Network Ingest', value: '1.24 Gbps', change: '+12.4%', trend: 'up' },
        { label: 'CPU Heat Map', value: '42.8°C', change: '-5.2%', trend: 'down' },
        { label: 'Active Matrix Nodes', value: '2,842', change: '+105', trend: 'up' },
        { label: 'Signal Integrity', value: '99.98%', change: 'OPTIMAL', trend: 'neutral' },
    ];

    return (
        <div className="p-12 space-y-12 max-w-[1400px] mx-auto animate-fade-in pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tight text-white flex items-center gap-5">
                        <span className="text-4xl p-3 bg-white/5 rounded-2xl border border-white/5">📈</span>
                        Telemetry Suite
                    </h1>
                    <p className="text-slate-400 font-bold tracking-tight ml-1">
                        Real-time system dynamics and audience distribution matrix.
                    </p>
                </div>
            </div>

            {/* Metrics HUD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {metrics.map((m, i) => (
                    <div key={i} className="glass-card rounded-[32px] p-8 transition-all hover:bg-white/[0.03] group relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3">{m.label}</p>
                            <p className="text-3xl font-black text-white tracking-tight mb-4 group-hover:text-indigo-400 transition-colors uppercase">
                                {m.value}
                            </p>
                            <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border ${m.trend === 'up' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                        m.trend === 'down' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                            'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                                    }`}>
                                    {m.change}
                                </span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            <span className="text-6xl font-black italic">{i + 1}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Main Graph Panel */}
                <div className="xl:col-span-8 space-y-8">
                    <div className="glass-card rounded-[48px] p-10 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                Bitrate Distribution Matrix
                            </h2>
                            <div className="flex gap-4">
                                <button className="px-5 py-2 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
                                    Export Logs
                                </button>
                                <span className="px-5 py-2 rounded-xl bg-indigo-500/10 text-[9px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-500/20 animate-pulse">
                                    LIVE STREAMING
                                </span>
                            </div>
                        </div>

                        {/* Tactical Visualization */}
                        <div className="h-[350px] flex items-end gap-3 px-2 relative z-10">
                            {[40, 70, 45, 90, 65, 80, 50, 95, 85, 40, 75, 60, 85, 100, 90, 80, 65, 85, 40, 55, 75, 95].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end gap-1 group/bar">
                                    <div
                                        className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-xl transition-all duration-[1500ms] group-hover/bar:from-indigo-400 group-hover/bar:to-pink-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                                        style={{ height: loading ? '0%' : `${h}%` }}
                                    />
                                    <div className="h-1 w-full bg-white/5 rounded-full" />
                                </div>
                            ))}
                        </div>

                        {/* Background Grid Elements */}
                        <div className="absolute inset-0 grid grid-cols-12 gap-1 opacity-[0.02] pointer-events-none">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="border-r border-white" />
                            ))}
                        </div>
                        <div className="absolute inset-0 flex flex-col justify-between p-10 pt-24 pb-14 opacity-[0.05] pointer-events-none">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="border-t border-white w-full" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Regional Stats */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="glass-card rounded-[40px] p-8 space-y-8">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Global Node Reach</h2>
                        <div className="space-y-8">
                            {[
                                { name: 'North America / Virginia', score: 85, color: 'bg-indigo-500' },
                                { name: 'EU Central / Frankfurt', score: 62, color: 'bg-purple-500' },
                                { name: 'Asia Pacific / Mumbai', score: 55, color: 'bg-pink-500' },
                                { name: 'Oceania / Sydney', score: 48, color: 'bg-emerald-500' },
                            ].map((r, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{r.name}</p>
                                        </div>
                                        <p className="text-xs font-black text-white">{r.score}%</p>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className={`h-full ${r.color} transition-all duration-[2000ms] shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                                            style={{ width: loading ? '0%' : `${r.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Insight Module */}
                    <div className="glass-card rounded-[40px] p-8 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                                🏮
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Peak Operational Window</h3>
                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Calculated by LIVATTO AI</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 font-bold leading-relaxed mb-6">
                            Optimal viewer retention identified between <span className="text-white">18:00 — 22:00 UTC</span>. Signal intensity recalibration recommended for this node.
                        </p>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Node Status: OPTIMAL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
