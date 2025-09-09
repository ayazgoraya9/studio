
import { createClient } from '@/lib/supabase/server';
import { ArrowRight, Package, FileText, Warehouse } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

async function DashboardStats() {
  const supabase = createClient();
  const [
    { count: productCount },
    { count: reportCount },
    { count: requestCount }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('daily_reports').select('*', { count: 'exact', head: true }),
    supabase.from('stock_requests').select('*', { count: 'exact', head: true, })
  ]);
  
  const stats = [
    { title: "Total Products", value: productCount ?? 0, icon: Package, description: "Manage your product inventory" },
    { title: "Daily Reports", value: reportCount ?? 0, icon: FileText, description: "Total reports from employees" },
    { title: "Stock Requests", value: requestCount ?? 0, icon: Warehouse, description: "Pending requests for stock" },
  ];

  return (
     <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {stats.map(stat => (
            <div key={stat.title} className="border bg-card text-card-foreground shadow-sm rounded-lg p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium">{stat.title}</h3>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
            </div>
        ))}
      </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border bg-card text-card-foreground shadow-sm rounded-lg p-6 animate-pulse">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-2/4" />
                <div className="h-4 w-4 bg-muted rounded" />
            </div>
            <div>
                <div className="h-7 w-1/4 bg-muted rounded mb-2" />
                <div className="h-3 w-3/4 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
  );
}

export default function AdminDashboardPage() {
  const quickLinks = [
    { title: "Manage Products", description: "Add, edit, or remove products.", href: "/admin/products", linkText: "Go to Products" },
    { title: "View Reports", description: "Review daily sales and expense reports.", href: "/admin/reports", linkText: "View All Reports" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, Admin!</h1>
        <p className="text-muted-foreground">
          Here's a quick overview of your retail operations.
        </p>
      </div>
      
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2">
        {quickLinks.map(link => (
          <div key={link.title} className="border bg-card text-card-foreground shadow-sm rounded-lg p-6 flex flex-col">
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold leading-none tracking-tight mb-1.5">{link.title}</h2>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </div>
            <div className="pt-6">
              <Link href={link.href} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                {link.linkText} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
