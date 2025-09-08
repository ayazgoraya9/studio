import { createClient } from "@/lib/supabase/server";
import { ProductsClient } from "./products-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products, error } = await supabase.from("products").select("*").order('created_at', { ascending: false });

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" asChild>
        <Link href="/admin">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <ProductsClient serverProducts={products || []} />
    </div>
  );
}
