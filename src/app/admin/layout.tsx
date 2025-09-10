
'use client';

import Link from 'next/link';
import { logout } from '../login/actions';
import { createClient } from '@/lib/supabase/client';
import React, { Suspense, useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';

function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        fetchUser();
    }, []);

    const getInitials = (email?: string | null) => {
        if (!email) return '?';
        const parts = email.split('@')[0].split(/[._-]/);
        return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    }

    if (loading) {
        return <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse" />;
    }

    return (
        <div className="flex items-center gap-4">
             <p className="text-sm text-right text-gray-400 hidden md:block">
                {user?.email ?? ''}
            </p>
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-600 text-white font-bold">
                <span>{getInitials(user?.email)}</span>
            </div>
        </div>
    )
}

function NavLinks() {
    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
            <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-700 hover:text-white">
              Dashboard
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-700 hover:text-white">
              Products
            </Link>
            <Link href="/admin/reports" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-700 hover:text-white">
              Employee Reports
            </Link>
            <Link href="/admin/stock-requests" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-700 hover:text-white">
              Stock Requests
            </Link>
        </nav>
    );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r border-gray-700 bg-gray-800 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-gray-700 px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-white">
              <span>RetailSync Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <NavLinks />
          </div>
          <div className="mt-auto p-4 space-y-2">
             <form action={logout}>
                <button type="submit" className="w-full text-left flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-700 hover:text-white">
                    <span>Log out</span>
                </button>                    
            </form>
            <Link href="/" className='w-full justify-start flex items-center gap-3 rounded-lg border border-gray-700 px-3 py-2 text-gray-300 transition-all hover:bg-gray-700 hover:text-white'>
                Back to Home
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      {isSidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50 md:hidden`}>
           <div className="flex h-14 items-center border-b border-gray-700 px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold text-white">
                <span>RetailSync Admin</span>
              </Link>
            </div>
            <div onClick={() => setIsSidebarOpen(false)}>
              <NavLinks />
            </div>
             <div className="absolute bottom-0 w-full p-4 space-y-2">
               <form action={logout}>
                  <button type="submit" className="w-full text-left flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:bg-gray-700 hover:text-white">
                      <span>Log out</span>
                  </button>                    
              </form>
              <Link href="/" className='w-full justify-start flex items-center gap-3 rounded-lg border border-gray-700 px-3 py-2 text-gray-300 transition-all hover:bg-gray-700 hover:text-white'>
                  Back to Home
              </Link>
            </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-gray-700 bg-gray-800/40 px-4 lg:h-[60px] lg:px-6">
          <button className="md:hidden p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="w-full flex-1">
            {/* Can add a search bar here in the future */}
          </div>
          <Suspense fallback={<div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse" />}>
            <UserProfile />
          </Suspense>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-900 text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
