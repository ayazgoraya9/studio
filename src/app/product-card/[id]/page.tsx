import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/app/employee/products/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProductCardPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const { data: product } = await supabase.from('products').select('*').eq('id', params.id).single();

    if (!product) {
        notFound();
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <ProductCard product={product} />
            <div className="mt-8">
                 <Button asChild variant="outline">
                    <Link href="/employee/products">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Product List
                    </Link>
                </Button>
            </div>
        </div>
    );
}
