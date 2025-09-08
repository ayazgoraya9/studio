import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Shield, User } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 antialiased">
      <header className="mb-12 text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
            <Logo className="w-16 h-16" />
            <h1 className="text-5xl font-bold font-headline text-primary">
                RetailSync
            </h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Streamlining Your Retail Operations
        </p>
      </header>
      
      <div className="w-full max-w-4xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                <span className="text-3xl">Admin Portal</span>
              </CardTitle>
              <CardDescription>
                Manage products, view reports, and oversee all shop operations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin">
                  Go to Admin Dashboard <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="w-8 h-8 text-primary" />
                <span className="text-3xl">Employee Portal</span>
              </CardTitle>
              <CardDescription>
                View products, submit daily reports, and request new stock.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/employee">
                  Go to Employee Portal <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

       <footer className="mt-16 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} RetailSync. All rights reserved.</p>
        </footer>
    </div>
  );
}
