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

export default function EmployeeDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-headline">Welcome!</h2>
      <p className="text-muted-foreground">
        Your daily tasks are just a click away.
      </p>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Product List
            </CardTitle>
            <CardDescription>
              View all available products and their current prices.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Button asChild className="w-full">
              <Link href="/employee/products">
                View Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Daily Report
            </CardTitle>
            <CardDescription>
              Submit your end-of-day sales and expense report.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Button asChild className="w-full">
              <Link href="/employee/daily-report">
                Submit Report <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-6 w-6 text-primary" />
              Stock Request
            </CardTitle>
            <CardDescription>
              Request new inventory for your shop.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end">
            <Button asChild className="w-full">
              <Link href="/employee/stock-request">
                Request Stock <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
