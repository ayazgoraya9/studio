import { createClient } from "@/lib/supabase/server";
import { ShoppingListClient } from "./shopping-list-client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ShoppingListPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    const { data: shoppingList, error } = await supabase
        .from('shopping_lists')
        .select(`*, shopping_list_items(*)`)
        .eq('id', params.id)
        .single();

    if (error || !shoppingList) {
        return notFound();
    }
    
    return (
        <div className="space-y-4">
            <Button variant="outline" asChild>
                <Link href="/admin/stock-requests">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Stock Requests
                </Link>
            </Button>
            <ShoppingListClient serverList={shoppingList} />
        </div>
    );
}
