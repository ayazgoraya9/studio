
'use client';

import { mergeStockRequests } from "@/lib/actions";
import type { FullStockRequest } from "@/lib/types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Combine } from "lucide-react";
import { useTransition } from "react";

interface StockRequestsClientProps {
  requestsByShop: Record<string, FullStockRequest[]>;
}

export function StockRequestsClient({ requestsByShop }: StockRequestsClientProps) {
    const [isPending, startTransition] = useTransition();

    const handleMerge = (shopName: string, requests: FullStockRequest[]) => {
        startTransition(async () => {
            const requestIds = requests.map(r => r.id);
            await mergeStockRequests(shopName, requestIds);
        });
    };

    if (Object.keys(requestsByShop).length === 0) {
        return (
            <div className="border bg-card text-card-foreground shadow-sm rounded-lg p-6 text-center">
                <h2 className="text-2xl font-semibold leading-none tracking-tight">Pending Stock Requests</h2>
                <p className="text-center text-muted-foreground p-8">
                    No pending stock requests.
                </p>
            </div>
        )
    }

  return (
    <div className="border bg-card text-card-foreground shadow-sm rounded-lg">
      <div className="p-6">
        <h2 className="text-2xl font-semibold leading-none tracking-tight">Requests by Shop</h2>
      </div>
      <div className="p-6 pt-0">
        <div className="w-full space-y-2">
          {Object.entries(requestsByShop).map(([shopName, requests]) => (
            <details key={shopName} className="border rounded-md p-4 group" open>
              <summary className="text-lg font-semibold cursor-pointer list-none flex justify-between items-center">
                {shopName} ({requests.length} requests)
                <span className="text-sm text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 space-y-4">
                <div className="flex justify-end">
                    <form action={() => handleMerge(shopName, requests)}>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto"
                        >
                            <Combine className="mr-2 h-4 w-4" />
                            {isPending ? 'Merging...' : 'Merge & Create Shopping List'}
                        </button>
                    </form>
                </div>
                {requests.map((request, index) => (
                  <div key={request.id}>
                    <div className="mb-2">
                        <h4 className="font-semibold">Request from {formatDistanceToNow(parseISO(request.created_at!), { addSuffix: true })}</h4>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {request.stock_request_items.map((item) => (
                        <li key={item.id}>
                          <span className="font-medium text-foreground">{item.products?.name || 'Unknown Product'}: </span> 
                          {item.quantity} {item.products?.unit || ''}
                        </li>
                      ))}
                    </ul>
                    {index < requests.length - 1 && <hr className="my-4"/>}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </CardContent>
    </div>
  );
}
