
// src/app/admin/products/page.tsx

import { createClient } from "@/lib/supabase/server";
import { ProductsClient } from "./products-client";
import Link from "next/link";

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products, error } = await supabase.from("products").select("*").order('name', { ascending: true });

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Manage Products</h1>
            <Link href="/admin/products/new" className="inline-block px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90">
                Add New Product
            </Link>
        </div>
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Back to Dashboard
        </Link>
      <ProductsClient serverProducts={products || []} />
    </div>
  );
}
