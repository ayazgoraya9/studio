import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StockRequestForm } from "./stock-request-form";
import { createClient } from "@/lib/supabase/server";

export default async function StockRequestPage() {
  const supabase = createClient();
  const { data: products } = await supabase.from('products').select('id, name, unit').order('name');
  
  return (
    <div className="max-w-4xl mx-auto">
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
