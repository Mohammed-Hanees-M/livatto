'use client';

import { useEffect, useState } from 'react';

const API = 'http://localhost:3001';

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
    const [selectedVideo, setSelectedVideo] = useState('');
    const [streamKey, setStreamKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeStream, setActiveStream] = useState<ActiveStream | null>(null);
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
            const res = await fetch(`${API}/videos`);
            const data = await res.json();
            setVideos(data || []);
        } catch (err) {
            setMessage('❌ Failed to load videos');
        }
    };

    const fetchActiveStream = async () => {
        try {
            const res = await fetch(`${API}/streams/active`);
            if (res.ok) {
                const data = await res.json();
                setActiveStream(data);

                // Enable polling if stream is running
                if (data && data.status === 'RUNNING') {
                    setIsPolling(true);
                } else {
                    setIsPolling(false);
                }
            } else {
                setActiveStream(null);
                setIsPolling(false);
            }
        } catch (err) {
            // No active stream or error
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
        setMessage('🚀 Starting 24/7 Live Stream...');

        try {
            const selectedVideoData = videos.find((v) => v.id === selectedVideo);

            if (!selectedVideoData) {
                setMessage('❌ Video not found');
                setLoading(false);
                return;
            }

            const streamRes = await fetch(`${API}/streams/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videoId: selectedVideo,
                    videoPath: selectedVideoData.filepath,
                    rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2',
                    streamKey: streamKey,
                }),
            });

            if (!streamRes.ok) {
                const error = await streamRes.json();
                setMessage(`❌ Failed: ${error.message || 'Unknown error'}`);
            } else {
                setMessage('✅ LIVE: Streaming to YouTube 24/7!');
                fetchActiveStream(); // Refresh status
            }
        } catch (error) {
            setMessage('❌ Failed to start stream');
        } finally {
            setLoading(false);
        }
    };

    // 🔥 NEW: One-click stop stream
    const stopStream = async () => {
        if (!activeStream) return;

        setLoading(true);
        setMessage('🛑 Stopping stream...');

        try {
            const res = await fetch(`${API}/streams/stop-active`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: 'User stopped manually' }),
            });

            if (res.ok) {
                setMessage('✅ Stream stopped successfully');
                setActiveStream(null);
                setIsPolling(false);
            } else {
                const error = await res.json();
                setMessage(`❌ Failed to stop: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            setMessage('❌ Failed to stop stream');
        } finally {
            setLoading(false);
        }
    };

    // 🔥 NEW: Switch video while streaming
    const switchVideo = async () => {
        if (!selectedVideo || !activeStream) {
            alert('Select a video to switch to');
            return;
        }

        setLoading(true);
        setMessage('🔄 Switching video...');

        try {
            const selectedVideoData = videos.find((v) => v.id === selectedVideo);

            if (!selectedVideoData) {
                setMessage('❌ Video not found');
                setLoading(false);
                return;
            }

            const res = await fetch(`${API}/streams/switch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videoId: selectedVideo,
                    videoPath: selectedVideoData.filepath,
                }),
            });

            if (res.ok) {
                setMessage('✅ Video switched successfully!');
                fetchActiveStream();
            } else {
                const error = await res.json();
                setMessage(`❌ Failed to switch: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            setMessage('❌ Failed to switch video');
        } finally {
            setLoading(false);
        }
    };

    // 🔥 Get status badge
    const getStatusBadge = () => {
        if (!activeStream) {
            return (
                <span style={{ color: '#666', fontWeight: 'bold' }}>
                    ⚫ STOPPED
                </span>
            );
        }

        switch (activeStream.status) {
            case 'RUNNING':
                return (
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                        🟢 LIVE
                    </span>
                );
            case 'STARTING':
                return (
                    <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                        🟡 STARTING...
                    </span>
                );
            case 'FAILED':
                return (
                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                        🔴 FAILED
                    </span>
                );
            default:
                return (
                    <span style={{ color: '#666', fontWeight: 'bold' }}>
                        ⚫ STOPPED
                    </span>
                );
        }
    };

    const isStreamActive = activeStream?.status === 'RUNNING' || activeStream?.status === 'STARTING';

    return (
        <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>
                📺 Livatto Live TV Control
            </h1>
            <p style={{ color: '#666', marginBottom: 24 }}>
                24/7 YouTube Loop Streaming • Live TV Mode
            </p>

            {/* 🔥 STATUS PANEL */}
            <div
                style={{
                    padding: 20,
                    border: '2px solid #ddd',
                    borderRadius: 12,
                    marginBottom: 24,
                    backgroundColor: activeStream?.status === 'RUNNING' ? '#f0fdf4' : '#f9fafb',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                            Stream Status
                        </h3>
                        <div style={{ fontSize: 20 }}>{getStatusBadge()}</div>
                    </div>

                    {activeStream && (
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 12, color: '#666' }}>
                                Currently Streaming
                            </div>
                            <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                                {activeStream.video?.title || activeStream.video?.filename || 'Unknown Video'}
                            </div>
                        </div>
                    )}
                </div>

                {activeStream?.lastError && (
                    <div
                        style={{
                            marginTop: 12,
                            padding: 10,
                            backgroundColor: '#fee2e2',
                            borderRadius: 6,
                            fontSize: 12,
                            color: '#991b1b',
                        }}
                    >
                        ⚠️ Error: {activeStream.lastError}
                    </div>
                )}
            </div>

            {/* 🔥 CONTROL PANEL */}
            <div
                style={{
                    padding: 20,
                    border: '1px solid #ddd',
                    borderRadius: 12,
                }}
            >
                <h2 style={{ fontSize: 20, marginBottom: 16 }}>
                    {isStreamActive ? '🔄 Switch Video or Stop Stream' : '🚀 Start 24/7 Stream'}
                </h2>

                {/* Video Selection */}
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '600' }}>
                    Select Video
                </label>
                <select
                    style={{
                        width: '100%',
                        padding: 12,
                        marginBottom: 16,
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        fontSize: 14,
                    }}
                    value={selectedVideo}
                    onChange={(e) => setSelectedVideo(e.target.value)}
                >
                    <option value="">-- Select Video --</option>
                    {videos.map((v) => (
                        <option key={v.id} value={v.id}>
                            {v.title || v.filename}
                        </option>
                    ))}
                </select>

                {/* Stream Key (only when not streaming) */}
                {!isStreamActive && (
                    <>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: '600' }}>
                            YouTube Stream Key
                        </label>
                        <input
                            type="text"
                            placeholder="Paste YouTube Stream Key"
                            value={streamKey}
                            onChange={(e) => setStreamKey(e.target.value)}
                            style={{
                                width: '100%',
                                padding: 12,
                                marginBottom: 16,
                                border: '1px solid #ccc',
                                borderRadius: 6,
                                fontSize: 14,
                            }}
                        />
                    </>
                )}

                {/* Control Buttons */}
                <div style={{ display: 'flex', gap: 12 }}>
                    {/* Start Button */}
                    {!isStreamActive && (
                        <button
                            onClick={start24x7Stream}
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: '14px 20px',
                                backgroundColor: loading ? '#ccc' : '#000',
                                color: 'white',
                                borderRadius: 8,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                border: 'none',
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}
                        >
                            {loading ? '⏳ Starting...' : '🚀 Start 24/7 Live'}
                        </button>
                    )}

                    {/* Switch Video Button */}
                    {isStreamActive && (
                        <button
                            onClick={switchVideo}
                            disabled={loading || !selectedVideo}
                            style={{
                                flex: 1,
                                padding: '14px 20px',
                                backgroundColor: loading || !selectedVideo ? '#ccc' : '#3b82f6',
                                color: 'white',
                                borderRadius: 8,
                                cursor: loading || !selectedVideo ? 'not-allowed' : 'pointer',
                                border: 'none',
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}
                        >
                            {loading ? '⏳ Switching...' : '🔄 Switch Video'}
                        </button>
                    )}

                    {/* Stop Button */}
                    {isStreamActive && (
                        <button
                            onClick={stopStream}
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: '14px 20px',
                                backgroundColor: loading ? '#ccc' : '#ef4444',
                                color: 'white',
                                borderRadius: 8,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                border: 'none',
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}
                        >
                            {loading ? '⏳ Stopping...' : '🛑 Stop Stream'}
                        </button>
                    )}
                </div>

                {/* Status Message */}
                {message && (
                    <div
                        style={{
                            marginTop: 16,
                            padding: 12,
                            backgroundColor: message.includes('❌') ? '#fee2e2' : '#dcfce7',
                            borderRadius: 6,
                            fontWeight: '600',
                            color: message.includes('❌') ? '#991b1b' : '#166534',
                        }}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
