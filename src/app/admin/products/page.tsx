
// src/app/admin/products/page.tsx

import { createClient } from "@/lib/supabase/server";
import { ProductsClient } from "./products-client";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products, error } = await supabase.from("products").select("*").order('name', { ascending: true });

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-headline">Manage Products</h1>
            <Link href="/admin/products/new" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                <PlusCircle className="h-4 w-4" /> Add New Product
            </Link>
        </div>
        <Link href="/admin" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      <ProductsClient serverProducts={products || []} />
    </div>
  );
}
