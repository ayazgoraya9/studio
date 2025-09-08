
import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { format, parseISO } from 'date-fns';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminPurchasingHistoryPage() {
  const supabase = createClient();
  const { data: history, error } = await supabase
    .from('purchasing_history')
    .select(`
        *,
        shopping_lists ( name )
    `)
    .order('purchase_date', { ascending: false });

  if(error) {
    return <div className="text-destructive">Error loading history: {error.message}</div>
  }

  const totalSpent = history.reduce((sum, item) => sum + item.total_cost, 0);

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
          <CardTitle className="text-2xl">Purchasing History</CardTitle>
          <CardDescription>A log of all completed shopping lists and their costs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-x-auto">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Purchase Date</TableHead>
                          <TableHead>Shopping List</TableHead>
                          <TableHead className="text-right">Total Cost</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {history.length === 0 && (
                          <TableRow>
                              <TableCell colSpan={3} className="text-center h-24">No purchasing history yet.</TableCell>
                          </TableRow>
                      )}
                      {history.map((item) => (
                          <TableRow key={item.id}>
                              <TableCell className="whitespace-nowrap font-medium">
                                {format(parseISO(item.purchase_date!), 'PPP')}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Link href={`/admin/shopping-list/${item.list_id}`} className="hover:underline text-primary">
                                    {item.shopping_lists?.name || 'Untitled List'}
                                </Link>
                              </TableCell>
                              <TableCell className="text-right whitespace-nowrap font-mono">
                                ${item.total_cost.toFixed(2)}
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </div>
        </CardContent>
         <CardFooter className="bg-secondary/50 p-4 rounded-b-lg">
            <div className="flex items-center justify-end w-full gap-4">
                <span className="text-lg font-semibold">Total Spent:</span>
                <Badge variant="secondary" className="text-xl">${totalSpent.toFixed(2)}</Badge>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
