import { createClient } from "@/lib/supabase/server";
import { ProductsClient } from "./products-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EmployeeProductsPage() {
  const supabase = createClient();
  const { data: products, error } = await supabase.from("products").select("*").order('name');

  return (
    <div className="space-y-4">
      <Button variant="outline" asChild>
        <Link href="/employee">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <h2 className="text-2xl font-bold">Product List</h2>
      <ProductsClient serverProducts={products || []} />
    </div>
  );
}
