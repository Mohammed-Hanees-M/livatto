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

        // Fetch real analytics data
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await api.get("/analytics/dashboard");
            setStats(response.data);
        } catch (error) {
            // If analytics fail, show zeros
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
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">🎥 Livatto Dashboard</h1>
                <p className="text-gray-500">
                    Welcome {userEmail ? userEmail : "User"} — Your Live Streaming Control Panel
                </p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow">
                    <h2 className="text-lg font-semibold">Total Streams</h2>
                    <p className="text-3xl font-bold mt-2">
                        {loading ? "..." : stats?.totalStreams || 0}
                    </p>
                </div>

                <div className="bg-green-600 text-white p-6 rounded-2xl shadow">
                    <h2 className="text-lg font-semibold">Total Videos</h2>
                    <p className="text-3xl font-bold mt-2">
                        {loading ? "..." : stats?.totalVideos || 0}
                    </p>
                </div>

                <div className="bg-orange-500 text-white p-6 rounded-2xl shadow">
                    <h2 className="text-lg font-semibold">Streaming Hours</h2>
                    <p className="text-3xl font-bold mt-2">
                        {loading ? "..." : `${stats?.totalStreamingHours.toFixed(1) || 0}h`}
                    </p>
                </div>

                <div className="bg-blue-600 text-white p-6 rounded-2xl shadow">
                    <h2 className="text-lg font-semibold">Uptime</h2>
                    <p className="text-3xl font-bold mt-2">
                        {loading ? "..." : `${stats?.uptimePercentage || 100}%`}
                    </p>
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow border">
                <h2 className="text-xl font-semibold mb-4">⚙️ System Status</h2>
                <ul className="space-y-2">
                    <li>🟢 Backend API: Running (localhost:3001)</li>
                    <li>🟢 Database: Connected (PostgreSQL)</li>
                    <li>🟢 Authentication: Active</li>
                    <li>🟡 Streaming Engine: FFmpeg (Not Connected Yet)</li>
                </ul>
            </div>
        </div>
    );
}
