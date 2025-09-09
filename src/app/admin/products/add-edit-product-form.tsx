
"use client";

import { useTransition } from "react";
import { upsertProduct } from "@/lib/actions";
import type { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface AddEditProductFormProps {
  product?: Product | null;
}

export function AddEditProductForm({ product }: AddEditProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await upsertProduct(formData);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: Object.values(result.error).flat().join("\n"),
        });
      } else {
         toast({
          title: "Success",
          description: `Product ${product ? "updated" : "added"} successfully.`,
        });
        router.push('/admin/products');
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      {product?.id && <input type="hidden" name="id" defaultValue={product.id} />}
      
      <div>
        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">Product Name</label>
        <input 
          id="name" 
          name="name"
          defaultValue={product?.name || ""}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>

      <div>
        <label htmlFor="unit" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">Unit (e.g., kg, piece, loaf)</label>
        <input 
          id="unit" 
          name="unit"
          defaultValue={product?.unit || ""}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>

      <div>
        <label htmlFor="price" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">Price</label>
        <input 
          id="price" 
          name="price"
          type="number" 
          step="0.01" 
          defaultValue={product?.price || ""}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>

      <button type="submit" disabled={isPending} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
        {isPending ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
