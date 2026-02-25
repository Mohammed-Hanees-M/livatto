"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface DashboardStats {
    totalStreams: number;
    totalVideos: number;
    totalStreamingHours: number;
    uptimePercentage: number;
    successfulStreams: number;
    failedStreams: number;
}

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                setUserEmail(parsedUser.email);
            } catch {
                setUserEmail(null);
            }
        }
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await api.get("/analytics/dashboard");
            setStats(response.data);
        } catch (error) {
            setStats({
                totalStreams: 0,
                totalVideos: 0,
                totalStreamingHours: 0,
                uptimePercentage: 100,
                successfulStreams: 0,
                failedStreams: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-12 space-y-12 max-w-[1400px] mx-auto animate-fade-in pb-20">
            {/* Header section with refined alignment */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tight text-white">
                        Mission Overview
                    </h1>
                    <p className="text-slate-400 font-bold tracking-tight">
                        Welcome back, <span className="text-white border-b border-indigo-500/50">{userEmail || 'Administrator'}</span>. System status is nominal.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="px-5 py-3 glass-card rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live Telemetry</span>
                    </div>
                </div>
            </div>

            {/* Premium Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {[
                    { label: 'Total Streams', value: stats?.totalStreams || 0, icon: '📡', color: 'indigo' },
                    { label: 'Media Library', value: stats?.totalVideos || 0, icon: '📁', color: 'emerald' },
                    { label: 'Runtime Hours', value: `${stats?.totalStreamingHours.toFixed(1) || 0}h`, icon: '⏱️', color: 'amber' },
                    { label: 'Uptime Score', value: `${stats?.uptimePercentage || 100}%`, icon: '💎', color: 'purple' }
                ].map((item, i) => (
                    <div
                        key={i}
                        className="glass-card p-8 rounded-[40px] group hover:scale-[1.02] transition-all duration-500 cursor-default relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${item.color}-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`} />

                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl shadow-inner border border-white/5 group-hover:border-${item.color}-500/30 transition-colors`}>
                                {item.icon}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-${item.color}-400/80`}>Active</span>
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{item.label}</h2>
                            <p className="text-4xl font-black text-white tracking-tighter">
                                {loading ? "---" : item.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Infrastructure & Action Center */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 glass-card rounded-[48px] p-10 relative overflow-hidden">
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                    <h2 className="text-2xl font-black mb-10 flex items-center gap-4 text-white uppercase tracking-tight">
                        <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                        Infrastructure Matrix
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                        {[
                            { name: 'Livatto Core API', status: 'Operational', details: 'v2.0.1 Stable', active: true },
                            { name: 'Prisma DB Cluster', status: 'Synchronized', details: 'PostgreSQL 16.2', active: true },
                            { name: 'JWT Auth Shield', status: 'Hardened', details: 'AES-256 Protocol', active: true },
                            { name: 'FFmpeg Node', status: 'Standby', details: 'GPU Accelerated', active: false },
                        ].map((sys, i) => (
                            <div key={i} className="flex flex-col p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-2.5 h-2.5 rounded-full ${sys.active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-amber-500'}`} />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">Node-0{i + 1}</span>
                                </div>
                                <p className="text-sm font-black text-white mb-1">{sys.name}</p>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.15em]">{sys.status} • {sys.details}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                    {/* Launch Card */}
                    <div className="flex-1 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl mb-8 border border-white/10">
                                🚀
                            </div>
                            <h2 className="text-3xl font-black mb-3 tracking-tight">Initialize Broadcast</h2>
                            <p className="text-indigo-100/70 text-sm mb-10 font-bold leading-relaxed">Prepare and launch your 24/7 automated transmission sequence.</p>

                            <button className="mt-auto w-full bg-white text-indigo-700 py-5 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-50 hover:scale-[1.02] transition-all active:scale-95">
                                Start Sequence
                            </button>
                        </div>
                        {/* High-end decorative glows */}
                        <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-white/10 rounded-full blur-[80px] group-hover:bg-white/20 transition-all duration-1000" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-purple-400/20 rounded-full blur-[60px]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
