import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StockRequestForm } from "./stock-request-form";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function StockRequestPage() {
  const supabase = createClient();
  const { data: products } = await supabase.from('products').select('id, name, unit').order('name');
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Button variant="outline" asChild>
        <Link href="/employee">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Request New Stock</CardTitle>
          <CardDescription>
            Select products and specify the quantities needed for your shop.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StockRequestForm products={products || []} />
        </CardContent>
      </Card>
    </div>
  );
}
