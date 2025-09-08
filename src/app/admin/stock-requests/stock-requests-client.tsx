'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
            <Card>
                <CardHeader>
                    <CardTitle>Pending Stock Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground p-8">
                        No pending stock requests.
                    </p>
                </CardContent>
            </Card>
        )
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Stock Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue={Object.keys(requestsByShop)[0]}>
          {Object.entries(requestsByShop).map(([shopName, requests]) => (
            <AccordionItem key={shopName} value={shopName}>
              <AccordionTrigger className="text-lg font-semibold">
                {shopName} ({requests.length} requests)
              </AccordionTrigger>
              <AccordionContent className="p-2 space-y-4">
                <div className="flex justify-end">
                    <Button 
                        onClick={() => handleMerge(shopName, requests)} 
                        disabled={isPending}
                        className="w-full sm:w-auto"
                    >
                        <Combine className="mr-2 h-4 w-4" />
                        {isPending ? 'Merging...' : 'Merge All & Create Shopping List'}
                    </Button>
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
                    {index < requests.length - 1 && <Separator className="my-4"/>}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
