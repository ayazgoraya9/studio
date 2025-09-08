import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, UserCog, User } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <header className="mb-12 text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Logo className="h-12 w-12" />
          <h1 className="text-5xl font-headline font-bold text-primary">
            RetailSync
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Streamline your retail operations with real-time data.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <UserCog className="h-8 w-8 text-primary" />
              <span className="text-2xl font-headline">Admin Dashboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Manage products, view reports, and oversee all store operations from one central hub.
            </p>
            <Button asChild className="w-full">
              <Link href="/admin">
                Go to Admin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="h-8 w-8 text-primary" />
              <span className="text-2xl font-headline">Employee Portal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Access product lists, submit daily reports, and request new stock for your shop.
            </p>
            <Button asChild className="w-full">
              <Link href="/employee">
                Go to Employee
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} RetailSync. All rights reserved.</p>
      </footer>
    </div>
  );
}
