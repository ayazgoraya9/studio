
import { createClient } from "@/lib/supabase/server";
import { StockRequestsClient } from "./stock-requests-client";
import type { FullStockRequest } from "@/lib/types";
import Link from "next/link";

export default async function StockRequestsPage() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('stock_requests')
        .select(`
            *,
            stock_request_items (
                *,
                products ( name, unit )
            )
        `)
        .eq('is_merged', false)
        .order('created_at', { ascending: false });
        
    if (error) {
        return <p className="text-destructive">Error loading stock requests: {error.message}</p>
    }

    const requests = data as FullStockRequest[];

    const requestsByShop = requests.reduce((acc, request) => {
        const shopName = request.shop_name || 'Unknown Shop';
        if (!acc[shopName]) {
            acc[shopName] = [];
        }
        acc[shopName].push(request);
        return acc;
    }, {} as Record<string, FullStockRequest[]>);

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Pending Stock Requests</h1>
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
              &larr; Back to Dashboard
            </Link>
            <StockRequestsClient requestsByShop={requestsByShop} />
        </div>
    );
}
