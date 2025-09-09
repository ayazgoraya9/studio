
// src/app/admin/layout.tsx

import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  FileText,
  Warehouse,
  Home,
  LogOut,
  PanelLeft,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { logout } from '../login/actions';
import { createClient } from '@/lib/supabase/server';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function UserProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const getInitials = (email?: string | null) => {
        if (!email) return 'U';
        const parts = email.split('@')[0].split(/[._-]/);
        return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Admin</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email ?? 'Loading...'}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                     <form action={logout} className="w-full">
                        <button type="submit" className="w-full text-left flex items-center">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function UserProfileSkeleton() {
    return <Skeleton className="h-8 w-8 rounded-full" />;
}


function NavLinks() {
    return (
        <>
            <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-primary hover:bg-sidebar-accent">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-primary hover:bg-sidebar-accent">
              <Package className="h-4 w-4" />
              Products
            </Link>
            <Link href="/admin/reports" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-primary hover:bg-sidebar-accent">
              <FileText className="h-4 w-4" />
              Employee Reports
            </Link>
            <Link href="/admin/stock-requests" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-primary hover:bg-sidebar-accent">
              <Warehouse className="h-4 w-4" />
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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo className="h-6 w-6" />
            <span>RetailSync</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavLinks />
        </nav>
        <div className="mt-auto p-4">
             <Button variant="outline" asChild>
                <Link href="/" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
        </div>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-72">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobile Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                    <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">RetailSync</span>
                </Link>
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-xl font-semibold flex-1">Admin Dashboard</h1>

          <div className="relative ml-auto flex-1 md:grow-0">
            {/* Search can go here in the future */}
          </div>
          <Suspense fallback={<UserProfileSkeleton />}>
            <UserProfile />
          </Suspense>
        </header>
        <main className="p-4 sm:p-0 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
