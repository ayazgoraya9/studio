
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Package, FileText, Warehouse } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Suspense } from 'react';
import DashboardSkeleton from './loading';

async function DashboardStats() {
  const supabase = createClient();
  // Fetch all counts in parallel
  const [
    { count: productCount },
    { count: reportCount },
    { count: requestCount }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('daily_reports').select('*', { count: 'exact', head: true }),
    supabase.from('stock_requests').select('*', { count: 'exact', head: true, })
  ]);
  
  return (
     <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Manage your product inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Daily Reports
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Total reports submitted by employees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Stock Requests</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requestCount ?? 0}</div>
             <p className="text-xs text-muted-foreground">
              Awaiting to be merged into a shopping list
            </p>
          </CardContent>
        </Card>
      </div>
  )
}

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-headline">Welcome, Admin!</h2>
      <p className="text-muted-foreground">
        Here's a quick overview of your retail operations.
      </p>
      
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manage Products</CardTitle>
            <CardDescription>
              Add, edit, or remove products from your inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/products">
                Go to Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>View Reports</CardTitle>
            <CardDescription>
              Review daily sales and expense reports from all shops.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/reports">
                View All Reports <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
