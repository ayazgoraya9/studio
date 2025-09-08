'use client'

import type { Product } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="print:p-0 p-8 flex items-center justify-center bg-background print:bg-transparent">
             <Card className="w-full max-w-md print:shadow-none print:border-none">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Logo className="h-16 w-16" />
                    </div>
                    <CardTitle className="text-5xl font-bold font-headline">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-7xl font-bold text-primary my-6">${product.price.toFixed(2)}</p>
                    <p className="text-3xl text-muted-foreground">per {product.unit}</p>
                </CardContent>
            </Card>
        </div>
    )
}
