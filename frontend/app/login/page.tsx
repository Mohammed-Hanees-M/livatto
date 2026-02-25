'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated, login, loading } = useAuth();

    useEffect(() => {
        if (isAuthenticated && !loading) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, loading, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            await login(email, password);
        } catch (error) {
            // Error handled in login function
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617]">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-indigo-400 uppercase tracking-widest">Load</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#020617]">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px]" />

            <div className="w-full max-w-[480px] z-10 animate-fade-in">
                <div className="glass-card rounded-[40px] p-12 relative overflow-hidden">
                    {/* Interior highlights */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/30 mb-8 relative group">
                            <span className="text-4xl group-hover:scale-110 transition-transform">🎬</span>
                            <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h1 className="text-4xl font-black tracking-[-0.04em] text-white uppercase mb-2">
                            Livatto Core
                        </h1>
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">
                            Secure Authentication
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/80 ml-1">
                                Administrator ID
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                required
                                className="glass-input w-full"
                                placeholder="Enter admin username"
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/80 ml-1">
                                Secure Key
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="glass-input w-full"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 active:scale-[0.98] mt-4 shadow-xl"
                        >
                            Authorize Access
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-12 pt-10 border-t border-white/5 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Biometric Ready</p>
                        </div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
                            Secured for Single-Admin Operation<br />
                            <span className="text-slate-700">© 2026 Livatto Platform v2.0.1</span>
                        </p>
                    </div>
                </div>

                {/* Bottom hint */}
                <p className="text-center mt-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Need Help? <Link href="#" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 ml-1">View Documentation</Link>
                </p>
            </div>
        </div>
    );
}
