
import { createClient } from "@/lib/supabase/server";
import { ShoppingListClient } from "./shopping-list-client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Product } from "@/lib/types";

export default async function ShoppingListPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    const { data: shoppingList, error: listError } = await supabase
        .from('shopping_lists')
        .select(`*, shopping_list_items(*)`)
        .eq('id', params.id)
        .single();
        
    const { data: products, error: productsError } = await supabase.from('products').select('id, name, price');

    if (listError || !shoppingList || productsError) {
        return notFound();
    }
    
    // Create a map for quick price lookup
    const productPriceMap = new Map<string, number>();
    products.forEach(p => productPriceMap.set(p.id, p.price));
    
    return (
        <div className="space-y-4">
            <Link href="/admin/stock-requests" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Stock Requests
            </Link>
            <ShoppingListClient serverList={shoppingList} productPriceMap={productPriceMap} />
        </div>
    );
}
