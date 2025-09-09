
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
            <DropdownMenuContent className="w-56" align="end" title="User menu">
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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-6 w-6" />
              <span className="">RetailSync</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-1">
              <NavLinks />
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Button size="sm" variant="outline" asChild>
                <Link href="/" className='w-full justify-start'>
                    <Home className="mr-2 h-4 w-4" /> 
                    Back to Home
                </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
             <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button> 
             </SheetTrigger> 
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Logo className="h-6 w-6" />
                  <span className="">RetailSync</span>
                </Link>
                <NavLinks />
              </nav>
              <div className="mt-auto">
                <Button size="sm" variant="outline" asChild>
                    <Link href="/" className='w-full justify-start'>
                        <Home className="mr-2 h-4 w-4" /> 
                        Back to Home
                    </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
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
