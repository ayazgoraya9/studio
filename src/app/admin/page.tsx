
import { createClient } from '@/lib/supabase/server';
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
    { title: "Total Products", value: productCount ?? 0, description: "Manage your product inventory" },
    { title: "Daily Reports", value: reportCount ?? 0, description: "Total reports from employees" },
    { title: "Stock Requests", value: requestCount ?? 0, description: "Pending requests for stock" },
  ];

  return (
     <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {stats.map(stat => (
            <div key={stat.title} className="border bg-card text-card-foreground shadow-sm rounded-lg p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium">{stat.title}</h3>
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
    { title: "Merge Stock Requests", description: "Combine requests into a shopping list.", href: "/admin/stock-requests", linkText: "View Requests" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, Admin!</h1>
        <p className="text-muted-foreground">
          Here's a quick overview of your retail operations.
        </p>
      </div>
      
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-3">
        {quickLinks.map(link => (
          <div key={link.title} className="border bg-card text-card-foreground shadow-sm rounded-lg p-6 flex flex-col">
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold mb-1.5">{link.title}</h2>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </div>
            <div className="pt-6">
              <Link href={link.href} className="inline-block w-full text-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90">
                {link.linkText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
