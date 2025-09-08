import { createClient } from "@/lib/supabase/server";
import { StockRequestsClient } from "./stock-requests-client";
import type { FullStockRequest } from "@/lib/types";

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
        if (!acc[request.shop_name]) {
            acc[request.shop_name] = [];
        }
        acc[request.shop_name].push(request);
        return acc;
    }, {} as Record<string, FullStockRequest[]>);

    return <StockRequestsClient requestsByShop={requestsByShop} />;
}
