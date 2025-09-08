import { createClient } from "@/lib/supabase/server";
import { ProductsClient } from "./products-client";

export default async function EmployeeProductsPage() {
  const supabase = createClient();
  const { data: products, error } = await supabase.from("products").select("*").order('name');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <ProductsClient serverProducts={products || []} />
    </div>
  );
}
