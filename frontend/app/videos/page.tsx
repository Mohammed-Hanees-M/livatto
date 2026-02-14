"use client";

import { useEffect, useState } from "react";

interface Video {
    id: string;
    title: string;
    filename: string;
    uploadedAt: string;
}

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const API_URL = "http://localhost:3001";

    const fetchVideos = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/videos`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setVideos(data || []);
        } catch (error) {
            // Error handled silently - non-critical for page load
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
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", title);

            const res = await fetch(`${API_URL}/videos`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (res.ok) {
                alert("Video uploaded successfully!");
                setTitle("");
                setFile(null);
                fetchVideos();
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            alert("Upload error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
                🎥 Video Library
            </h1>

            {/* Upload Form */}
            <form onSubmit={handleUpload} style={{ marginTop: "20px" }}>
                <input
                    type="text"
                    placeholder="Video Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ padding: "10px", marginRight: "10px", width: "250px" }}
                />

                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    style={{ marginRight: "10px" }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "10px 20px",
                        background: "black",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    {loading ? "Uploading..." : "Upload Video"}
                </button>
            </form>

            {/* Video List */}
            <div style={{ marginTop: "40px" }}>
                <h2>Uploaded Videos</h2>

                {videos.length === 0 ? (
                    <p>No videos uploaded yet.</p>
                ) : (
                    <ul>
                        {videos.map((video) => (
                            <li key={video.id} style={{ marginBottom: "10px" }}>
                                <strong>{video.title}</strong> — {video.filename}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
