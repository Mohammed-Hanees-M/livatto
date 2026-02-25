"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface Video {
    id: string;
    title: string;
    filename: string;
    uploadedAt: string;
    filesize?: number;
}

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const fetchVideos = async () => {
        try {
            const res = await api.get("/videos");
            if (Array.isArray(res.data)) {
                setVideos(res.data);
            } else {
                setVideos([]);
            }
        } catch (error) {
            setVideos([]);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) {
            alert("Please provide title and video file");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", title);

            await api.post("/videos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setTitle("");
            setFile(null);
            fetchVideos();
        } catch (error: any) {
            const errMsg = error.response?.data?.message || "Upload failed";
            alert(`Upload error: ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const deleteVideo = async (id: string) => {
        if (!confirm("Are you sure you want to decommission this asset?")) return;
        try {
            await api.delete(`/videos/${id}`);
            fetchVideos();
        } catch (error) {
            alert("Failed to delete asset");
        }
    };

    return (
        <div className="p-12 space-y-12 max-w-[1400px] mx-auto animate-fade-in pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tight text-white flex items-center gap-5">
                        <span className="text-4xl p-3 bg-white/5 rounded-2xl border border-white/5">🎥</span>
                        Asset Library
                    </h1>
                    <p className="text-slate-400 font-bold tracking-tight ml-1">
                        High-performance repository for your broadcast media.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                {/* Upload Panel */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="glass-card rounded-[40px] p-8 space-y-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                            Ingest New Asset
                        </h3>

                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Asset Designation</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Primary Stream Loop"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="glass-input w-full font-bold text-sm"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Payload Source</label>
                                <div
                                    className={`relative group border-2 border-dashed rounded-[32px] p-10 text-center transition-all duration-300 ${dragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                    onDragLeave={() => setDragActive(false)}
                                    onDrop={(e) => { e.preventDefault(); setDragActive(false); setFile(e.dataTransfer.files[0]); }}
                                >
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="space-y-4">
                                        <span className="text-4xl block opacity-30 group-hover:opacity-100 transition-opacity">
                                            {file ? '✅' : '📥'}
                                        </span>
                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest truncate max-w-full px-4">
                                            {file ? file.name : 'Select Data Package'}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-bold">MAX 5GB PER SESSION</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !file || !title}
                                className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'INITIALIZING UPLOAD...' : 'DEPLOY ASSET'}
                            </button>
                        </form>
                    </div>

                    <div className="glass-card rounded-[32px] p-6 border-indigo-500/20 bg-indigo-500/5">
                        <div className="flex items-center gap-4">
                            <span className="text-xl">⚡</span>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                                Assets are optimized for ultra-low latency playback.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Video Grid Section */}
                <div className="xl:col-span-8 space-y-8">
                    <div className="flex justify-between items-center bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/5">
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">Vault Inventory</h2>
                        <div className="flex items-center gap-4">
                            <span className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                                {videos.length} Active Nodes
                            </span>
                        </div>
                    </div>

                    {videos.length === 0 ? (
                        <div className="glass-card rounded-[48px] p-32 text-center opacity-40">
                            <span className="text-6xl block mb-6 grayscale">🗄️</span>
                            <p className="text-lg font-black text-white uppercase tracking-widest">Vault is empty</p>
                            <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest">Awaiting first data ingestion</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {videos.map((video) => (
                                <div
                                    key={video.id}
                                    className="group glass-card rounded-[40px] p-6 transition-all hover:bg-white/[0.03] hover:translate-y-[-4px]"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                            🎞️
                                        </div>
                                        <button
                                            onClick={() => deleteVideo(video.id)}
                                            className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                        >
                                            <span className="text-sm">🗑️</span>
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-black text-white truncate group-hover:text-indigo-400 transition-colors">
                                            {video.title}
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            <span className="px-3 py-1.5 rounded-lg bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest border border-white/5">
                                                ID: {video.id.substring(0, 8)}
                                            </span>
                                            <span className="px-3 py-1.5 rounded-lg bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest border border-white/5">
                                                {new Date(video.uploadedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
