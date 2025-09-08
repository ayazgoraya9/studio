import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from 'date-fns';
import { Button } from "@/components/ui/button";
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
       <Button variant="outline" asChild>
        <Link href="/admin">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Employee Daily Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-x-auto">
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
                              <TableCell className="whitespace-nowrap">{format(parseISO(report.created_at!), 'PPP')}</TableCell>
                              <TableCell className="font-medium whitespace-nowrap">{report.shop_name}</TableCell>
                              <TableCell className="whitespace-nowrap">{report.salesman_name}</TableCell>
                              <TableCell className="text-right whitespace-nowrap">${report.total_sales.toFixed(2)}</TableCell>
                              <TableCell className="text-right whitespace-nowrap">${report.total_expenses.toFixed(2)}</TableCell>
                              <TableCell className="text-right font-bold whitespace-nowrap">${(report.total_sales - report.total_expenses).toFixed(2)}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
