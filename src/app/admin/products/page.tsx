import { createClient } from "@/lib/supabase/server";
import { ProductsClient } from "./products-client";

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products, error } = await supabase.from("products").select("*").order('created_at', { ascending: false });

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  return <ProductsClient serverProducts={products || []} />;
}
