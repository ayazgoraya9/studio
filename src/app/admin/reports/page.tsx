import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from 'date-fns';

export default async function AdminReportsPage() {
  const supabase = createClient();
  const { data: reports, error } = await supabase.from('daily_reports').select('*').order('created_at', { ascending: false });

  if(error) {
    return <div className="text-destructive">Error loading reports: {error.message}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Daily Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Shop Name</TableHead>
                        <TableHead>Salesman</TableHead>
                        <TableHead className="text-right">Total Sales</TableHead>
                        <TableHead className="text-right">Total Expenses</TableHead>
                        <TableHead className="text-right">Net</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reports.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">No reports submitted yet.</TableCell>
                        </TableRow>
                    )}
                    {reports.map((report) => (
                        <TableRow key={report.id}>
                            <TableCell>{format(parseISO(report.created_at!), 'PPP')}</TableCell>
                            <TableCell className="font-medium">{report.shop_name}</TableCell>
                            <TableCell>{report.salesman_name}</TableCell>
                            <TableCell className="text-right">${report.total_sales.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${report.total_expenses.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-bold">${(report.total_sales - report.total_expenses).toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
