"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Share2 } from "lucide-react";
import { ProductCard } from "./product-card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductsClientProps {
  serverProducts: Product[];
}

export function ProductsClient({ serverProducts }: ProductsClientProps) {
  const [products, setProducts] = useState(serverProducts);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime-employee-products")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "products" },
        (payload) => {
          setProducts(current =>
            current.map(p => (p.id === payload.new.id ? payload.new as Product : p))
          );
          setHighlighted(payload.new.id);
          setTimeout(() => setHighlighted(null), 2000); // Highlight for 2 seconds
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleShare = async (product: Product) => {
    const cardUrl = `${window.location.origin}/product-card/${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at $${product.price.toFixed(2)} per ${product.unit}`,
          url: cardUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(cardUrl);
      alert("Link copied to clipboard!");
    }
  };

  const handlePrint = (product: Product) => {
    setSelectedProduct(product);
  };
  
  useEffect(() => {
    if(selectedProduct){
        setTimeout(() => window.print(), 100);
    }
  }, [selectedProduct])

  if (selectedProduct) {
    return (
      <div className="printable-area">
        <ProductCard product={selectedProduct} />
        <div className="no-print p-4 flex justify-center">
            <Button onClick={() => setSelectedProduct(null)}>Back to Product List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className={`transition-all duration-500 ${
            highlighted === product.id ? "bg-accent/50 shadow-lg" : ""
          }`}
        >
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
            <p className="text-muted-foreground">per {product.unit}</p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePrint(product)}
              className="w-full"
            >
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare(product)}
              className="w-full"
            >
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
