
import Link from 'next/link';
import { logout } from '../login/actions';
import { createClient } from '@/lib/supabase/server';
import React, { Suspense } from 'react';

async function UserProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const getInitials = (email?: string | null) => {
        if (!email) return '?';
        const parts = email.split('@')[0].split(/[._-]/);
        return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    }

    return (
        <div className="flex items-center gap-4">
             <p className="text-sm text-right text-muted-foreground hidden md:block">
                {user?.email ?? 'Loading...'}
            </p>
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-foreground">
                <span>{getInitials(user?.email)}</span>
            </div>
        </div>
    )
}

function UserProfileSkeleton() {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
}

function NavLinks() {
    const commonClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
    return (
        <>
            <Link href="/admin" className={commonClasses}>
              Dashboard
            </Link>
            <Link href="/admin/products" className={commonClasses}>
              Products
            </Link>
            <Link href="/admin/reports" className={commonClasses}>
              Employee Reports
            </Link>
            <Link href="/admin/stock-requests" className={commonClasses}>
              Stock Requests
            </Link>
        </>
    )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-sidebar-primary-foreground">
              <span className="">RetailSync Admin</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
              <NavLinks />
            </nav>
          </div>
          <div className="mt-auto p-4 space-y-2">
             <form action={logout}>
                <button type="submit" className="w-full text-left flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    <span>Log out</span>
                </button>                    
            </form>
            <Link href="/" className='w-full justify-start flex items-center gap-3 rounded-lg border border-sidebar-border px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'>
                Back to Home
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            {/* Can add a search bar here in the future */}
          </div>
          <Suspense fallback={<UserProfileSkeleton />}>
            <UserProfile />
          </Suspense>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
