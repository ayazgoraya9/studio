
// src/app/admin/products/products-client.tsx
"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Edit } from "lucide-react";
import Link from "next/link";

interface ProductsClientProps {
  serverProducts: Product[];
}

export function ProductsClient({ serverProducts }: ProductsClientProps) {
  const [products, setProducts] = useState(serverProducts);
  const supabase = createClient();

  useEffect(() => {
    setProducts(serverProducts);
  }, [serverProducts]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
            if (payload.eventType === 'INSERT') {
                setProducts(current => [payload.new as Product, ...current].sort((a,b) => a.name.localeCompare(b.name)));
            }
            if (payload.eventType === 'UPDATE') {
                setProducts(current => current.map(p => p.id === payload.new.id ? payload.new as Product : p));
            }
            if (payload.eventType === 'DELETE') {
                setProducts(current => current.filter(p => p.id !== payload.old.id));
            }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);


  return (
    <div className="border rounded-lg overflow-x-auto bg-card text-card-foreground">
        <table className="w-full text-sm">
          <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Unit</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Price</th>
              <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground w-[80px]">Actions</th>
              </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
              {products.map((product) => (
              <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium whitespace-nowrap">{product.name}</td>
                  <td className="p-4 align-middle whitespace-nowrap">{product.unit}</td>
                  <td className="p-4 align-middle text-right whitespace-nowrap">
                  ${product.price.toFixed(2)}
                  </td>
                  <td className="p-4 align-middle text-center">
                  <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                  >
                      <Edit className="h-4 w-4" />
                  </Link>
                  </td>
              </tr>
              ))}
          </tbody>
        </table>
    </div>
  );
}
