'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 800);
    };

    return (
        <div className="p-12 space-y-12 max-w-[1000px] mx-auto animate-fade-in pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tight text-white flex items-center gap-5">
                        <span className="text-4xl p-3 bg-white/5 rounded-2xl border border-white/5">⚙️</span>
                        Core Settings
                    </h1>
                    <p className="text-slate-400 font-bold tracking-tight ml-1">
                        Global transmission parameters and system-level protocols.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {/* General Config */}
                <div className="glass-card rounded-[40px] p-10 space-y-10">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                        Platform Configuration
                    </h2>

                    <div className="space-y-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-white uppercase tracking-tight">System Identity</h3>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Public designation for this instance</p>
                            </div>
                            <input
                                type="text"
                                defaultValue="LIVATTO CORE COMMAND"
                                className="glass-input w-full md:w-80 font-bold text-sm"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-white/5 pt-10">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-white uppercase tracking-tight">Deployment Environment</h3>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Current operational state</p>
                            </div>
                            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                                <button className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white text-slate-900 shadow-xl transition-all">PRODUCTION</button>
                                <button className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">DEBUG MODE</button>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-white/5 pt-10">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-white uppercase tracking-tight">Autonomous Recovery</h3>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Self-healing protocols for signal failures</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-14 h-7 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600 transition-colors"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Transmission Config */}
                <div className="glass-card rounded-[40px] p-10 space-y-10">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-purple-500 rounded-full" />
                        Broadcast Protocols
                    </h2>

                    <div className="space-y-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-white uppercase tracking-tight">Primary RTMP Ingest</h3>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Global target for 24/7 transmissions</p>
                            </div>
                            <input
                                type="text"
                                defaultValue="rtmp://a.rtmp.youtube.com/live2"
                                className="glass-input w-full md:w-80 font-mono text-xs tracking-wider"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-white/5 pt-10">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-white uppercase tracking-tight">Buffer Strategy</h3>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Memory allocation for stream integrity</p>
                            </div>
                            <select className="glass-input w-full md:w-80 font-bold text-sm appearance-none cursor-pointer">
                                <option className="bg-slate-900">ULTRA-LOW LATENCY</option>
                                <option className="bg-slate-900">BALANCED STABILITY</option>
                                <option className="bg-slate-900">HIGH FIDELITY BUFFER</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Emergency Zone */}
                <div className="glass-card rounded-[40px] p-10 space-y-8 border-red-500/20 bg-red-500/5">
                    <h2 className="text-xl font-black text-red-500 uppercase tracking-tight flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-red-500 rounded-full" />
                        Emergency Override
                    </h2>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-1">
                            <h3 className="text-sm font-black text-red-400 uppercase tracking-tight">Purge Data Vault</h3>
                            <p className="text-[10px] text-red-400/50 font-black uppercase tracking-[0.2em]">Irreversible deletion of all media assets</p>
                        </div>
                        <button className="px-8 py-3 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95">
                            EXECUTE PURGE
                        </button>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-6">
                    <button
                        onClick={handleSave}
                        className="px-16 py-6 bg-white text-slate-900 rounded-[28px] font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-4"
                    >
                        {loading && <div className="w-5 h-5 border-4 border-slate-900/30 border-t-slate-900 animate-spin rounded-full" />}
                        {loading ? 'CALIBRATING...' : 'SAVE CONFIGURATION'}
                    </button>
                </div>
            </div>
        </div>
    );
}
