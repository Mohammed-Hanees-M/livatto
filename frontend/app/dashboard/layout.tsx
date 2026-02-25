'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 overflow-auto bg-transparent relative">
                    {/* Content Area */}
                    <div className="relative z-10 h-full">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
