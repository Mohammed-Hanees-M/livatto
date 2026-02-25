'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Video Library', href: '/dashboard/videos', icon: '🎥' },
    { name: 'Scheduler', href: '/dashboard/scheduler', icon: '📅' },
    { name: 'AI Tools', href: '/dashboard/ai-tools', icon: '🤖' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <div className="w-72 bg-[var(--bg-sidebar)] border-r border-white/[0.05] flex flex-col h-screen sticky top-0 backdrop-blur-3xl z-50">
            {/* Logo Section */}
            <div className="p-10">
                <div className="flex items-center gap-4 group cursor-default">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-500">
                        🎬
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            LIVATTO
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-400/80 font-black">
                            Core v2.0
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 py-4 space-y-2.5 overflow-y-auto custom-scrollbar">
                <div className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Control Center
                </div>
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                                ? 'bg-white/5 text-white border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)]'
                                : 'text-slate-400 hover:bg-white/[0.02] hover:text-white border border-transparent'
                                }`}
                        >
                            <span className={`text-xl transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'group-hover:scale-110 opacity-70'}`}>
                                {item.icon}
                            </span>
                            <span className={`font-bold text-sm tracking-tight ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                {item.name}
                            </span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-6 mt-auto">
                <div className="bg-white/[0.03] rounded-3xl p-5 border border-white/[0.05] backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-white font-black text-lg shadow-inner">
                            {user?.email?.[0].toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-white truncate leading-none mb-1.5">
                                {user?.name || 'Administrator'}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">System Online</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/20"
                    >
                        Terminate Session
                    </button>
                </div>
            </div>
        </div>
    );
}
