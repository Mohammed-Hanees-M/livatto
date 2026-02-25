'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

interface Video {
    id: string;
    title: string;
    filename: string;
    filepath: string;
    duration?: number;
    filesize: bigint;
}

interface ActiveStream {
    id: string;
    status: string;
    videoId?: string;
    video?: Video;
    startedAt?: string;
    failureCount: number;
    lastError?: string;
}

export default function SchedulerPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [activeStream, setActiveStream] = useState<ActiveStream | null>(null);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [streamKey, setStreamKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isPolling, setIsPolling] = useState(false);

    // 🔥 Fetch videos on mount
    useEffect(() => {
        fetchVideos();
        fetchActiveStream(); // Initial fetch
    }, []);

    // 🔥 Poll active stream status every 3 seconds
    useEffect(() => {
        if (isPolling || activeStream?.status === 'RUNNING') {
            const interval = setInterval(() => {
                fetchActiveStream();
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [isPolling, activeStream?.status]);

    const fetchVideos = async () => {
        try {
            const res = await api.get('/videos');
            if (Array.isArray(res.data)) {
                setVideos(res.data);
            } else {
                setVideos([]);
            }
        } catch (err) {
            setMessage('❌ Failed to load videos');
            setVideos([]);
        }
    };

    const fetchActiveStream = async () => {
        try {
            const res = await api.get('/streams/active');
            const data = res.data;
            setActiveStream(data);

            if (data && (data.status === 'RUNNING' || data.status === 'STARTING')) {
                setIsPolling(true);
            } else {
                setIsPolling(false);
            }
        } catch (err) {
            setActiveStream(null);
            setIsPolling(false);
        }
    };

    const start24x7Stream = async () => {
        if (!selectedVideo || !streamKey) {
            alert('Select video and enter YouTube stream key');
            return;
        }

        setLoading(true);
        setMessage('🚀 Initializing Transmission Sequence...');

        try {
            const selectedVideoData = videos.find((v) => v.id === selectedVideo);

            if (!selectedVideoData) {
                setMessage('❌ Asset not found');
                setLoading(false);
                return;
            }

            await api.post('/streams/start', {
                videoId: selectedVideo,
                videoPath: selectedVideoData.filepath,
                rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2',
                streamKey: streamKey,
            });

            setMessage('✅ LIVE: Stream established successfully');
            fetchActiveStream();
        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Transmission failed';
            setMessage(`❌ ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const stopStream = async () => {
        setLoading(true);
        setMessage('🛑 Terminating Signal...');

        try {
            await api.post('/streams/stop-active', { reason: 'User termination' });
            setMessage('✅ Session terminated');
            setActiveStream(null);
            setIsPolling(false);
        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Termination failed';
            setMessage(`❌ ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const switchVideo = async () => {
        if (!selectedVideo) {
            alert('Select a new video to switch');
            return;
        }

        setLoading(true);
        setMessage('🔄 Recalibrating Signal...');

        try {
            const selectedVideoData = videos.find((v) => v.id === selectedVideo);

            if (!selectedVideoData) {
                setMessage('❌ Asset not found');
                setLoading(false);
                return;
            }

            await api.post('/streams/switch', {
                videoId: selectedVideo,
                videoPath: selectedVideoData.filepath,
            });

            setMessage('✅ Signal switched successfully!');
            fetchActiveStream();
        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Switch failed';
            setMessage(`❌ ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const isStreamActive = activeStream?.status === 'RUNNING' || activeStream?.status === 'STARTING';

    return (
        <div className="p-12 space-y-12 max-w-[1400px] mx-auto animate-fade-in pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tight text-white flex items-center gap-5">
                        <span className="text-4xl p-3 bg-white/5 rounded-2xl border border-white/5">📡</span>
                        Broadcast Center
                    </h1>
                    <p className="text-slate-400 font-bold tracking-tight ml-1">
                        Manage your 24/7 autonomous live transmission network.
                    </p>
                </div>
            </div>

            {/* Status Monitor Card */}
            <div className="glass-card rounded-[40px] p-10 relative overflow-hidden">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                    <div className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Global Switch Status</h2>
                        <div className="flex items-center gap-6">
                            <div className={`px-6 py-3 rounded-2xl border ${isStreamActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800/50 border-white/5 text-slate-500'} font-black text-sm uppercase tracking-widest`}>
                                {activeStream?.status || 'OFFLINE'}
                            </div>
                            {isStreamActive && (
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Signal Locked</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 w-full lg:max-w-md space-y-4">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500 px-1">
                            <span>Signal Intensity</span>
                            <span className="text-emerald-500">{activeStream ? '94%' : '0%'}</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div
                                className={`h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000 ${activeStream ? 'w-[94%]' : 'w-0'}`}
                            />
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Current Transmission</p>
                        <p className="text-xl font-black text-white italic">
                            {activeStream ? `Asset ID: ${activeStream.videoId?.substring(0, 8)}` : 'No Active Signal'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Control Panel */}
                <div className="xl:col-span-5 space-y-8">
                    <div className="glass-card rounded-[40px] p-8 space-y-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                            Initiate Sequence
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Select Media Asset</label>
                                <select
                                    value={selectedVideo}
                                    onChange={(e) => setSelectedVideo(e.target.value)}
                                    className="glass-input w-full appearance-none cursor-pointer font-bold text-sm"
                                >
                                    <option value="" className="bg-slate-900">— Link Library Asset —</option>
                                    {videos.map((v) => (
                                        <option key={v.id} value={v.id} className="bg-slate-900">
                                            {v.title || v.filename}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Destination Key (YouTube)</label>
                                <input
                                    type="password"
                                    placeholder="Enter encrypted ingest key"
                                    value={streamKey}
                                    onChange={(e) => setStreamKey(e.target.value)}
                                    className="glass-input w-full font-mono text-xs tracking-widest"
                                />
                            </div>

                            <div className="pt-4 flex flex-col gap-4">
                                {!isStreamActive ? (
                                    <button
                                        onClick={start24x7Stream}
                                        disabled={loading}
                                        className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? 'Processing...' : 'ESTABLISH BROADCAST'}
                                    </button>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={switchVideo}
                                            disabled={loading}
                                            className="px-6 py-5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500/20 transition-all active:scale-95"
                                        >
                                            RECALIBRATE
                                        </button>
                                        <button
                                            onClick={stopStream}
                                            disabled={loading}
                                            className="px-6 py-5 bg-red-600/20 text-red-400 border border-red-500/30 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all active:scale-95"
                                        >
                                            TERMINATE
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Console Output */}
                    {message && (
                        <div className="glass-card rounded-[32px] p-6 border-indigo-500/20 bg-indigo-500/5 animate-slide-in">
                            <div className="flex items-center gap-4">
                                <span className="text-xl">⚙️</span>
                                <p className="text-xs font-black uppercase tracking-widest text-indigo-300">
                                    {message.replace(/[❌✅🚀🛑🔄]/g, '').trim()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Live Preview / Matrix Wall */}
                <div className="xl:col-span-7 space-y-8">
                    <div className="glass-card rounded-[48px] p-3 aspect-video relative group overflow-hidden bg-black/60 shadow-inner">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {isStreamActive ? (
                                <div className="text-center space-y-4 animate-pulse">
                                    <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin mx-auto" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Signal Operational</p>
                                </div>
                            ) : (
                                <div className="text-center space-y-6 opacity-30 grayscale group-hover:opacity-50 transition-opacity">
                                    <div className="text-6xl">🎞️</div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Main Deck Idle</p>
                                </div>
                            )}
                        </div>

                        {/* Overlay elements */}
                        <div className="absolute top-8 left-8 flex items-center gap-3">
                            <div className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest">
                                CH-01
                            </div>
                            {isStreamActive && (
                                <div className="px-3 py-1.5 rounded-lg bg-red-600/80 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest animate-pulse">
                                    LIVE
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass-card rounded-3xl aspect-[4/3] flex items-center justify-center opacity-20 grayscale cursor-not-allowed group hover:opacity-30 transition-opacity">
                                <span className="text-3xl">📷</span>
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
