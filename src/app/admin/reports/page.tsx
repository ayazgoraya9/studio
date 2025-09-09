
import { createClient } from "@/lib/supabase/server";
import { format, parseISO } from 'date-fns';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminReportsPage() {
  const supabase = createClient();
  const { data: reports, error } = await supabase.from('daily_reports').select('*').order('created_at', { ascending: false });

  if(error) {
    return <div className="text-destructive">Error loading reports: {error.message}</div>
  }

  return (
    <div className="space-y-4">
        <h1 className="text-3xl font-bold font-headline">Employee Daily Reports</h1>
        <Link href="/admin" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

      <div className="border rounded-lg overflow-x-auto bg-card text-card-foreground">
        <table className="w-full text-sm">
            <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Shop Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Salesman</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total Sales</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total Expenses</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Net</th>
                </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
                {reports.length === 0 && (
                    <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">No reports submitted yet.</td>
                    </tr>
                )}
                {reports.map((report) => (
                    <tr key={report.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle whitespace-nowrap">{format(parseISO(report.created_at!), 'PPP')}</td>
                        <td className="p-4 align-middle font-medium whitespace-nowrap">{report.shop_name}</td>
                        <td className="p-4 align-middle whitespace-nowrap">{report.salesman_name}</td>
                        <td className="p-4 align-middle text-right whitespace-nowrap">${report.total_sales.toFixed(2)}</td>
                        <td className="p-4 align-middle text-right whitespace-nowrap">${report.total_expenses.toFixed(2)}</td>
                        <td className="p-4 align-middle text-right font-bold whitespace-nowrap">${(report.total_sales - report.total_expenses).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
