
// src/app/admin/products/products-client.tsx
"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { deleteProduct } from "@/lib/actions";

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

  const handleDelete = async (productId: string, productName: string) => {
    if(confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      await deleteProduct(productId);
    }
  }

  return (
    <div className="border rounded-lg overflow-x-auto bg-card text-card-foreground">
        <table className="w-full text-sm">
          <thead>
              <tr className="border-b">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Unit</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Price</th>
              <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
          </thead>
          <tbody>
              {products.map((product) => (
              <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium whitespace-nowrap">{product.name}</td>
                  <td className="p-4 align-middle whitespace-nowrap">{product.unit}</td>
                  <td className="p-4 align-middle text-right whitespace-nowrap">
                  ${product.price.toFixed(2)}
                  </td>
                  <td className="p-4 align-middle text-center space-x-2">
                    <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-block px-3 py-1 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-accent"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="inline-block px-3 py-1 text-sm rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </button>
                  </td>
              </tr>
              ))}
          </tbody>
        </table>
    </div>
  );
}
