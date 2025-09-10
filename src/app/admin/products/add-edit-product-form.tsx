
"use client";

import { useTransition } from "react";
import { upsertProduct } from "@/lib/actions";
import type { Product } from "@/lib/types";
import { useRouter } from "next/navigation";

interface AddEditProductFormProps {
  product?: Product | null;
}

export function AddEditProductForm({ product }: AddEditProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await upsertProduct(formData);
      if (result?.error) {
        alert("Error: " + Object.values(result.error).flat().join("\n"));
      } else {
         alert(`Product ${product ? "updated" : "added"} successfully.`);
        router.push('/admin/products');
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-card p-6 rounded-lg border">
      {product?.id && <input type="hidden" name="id" defaultValue={product.id} />}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Product Name</label>
        <input 
          id="name" 
          name="name"
          defaultValue={product?.name || ""}
          required
          className="block w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
        />
      </div>

      <div>
        <label htmlFor="unit" className="block text-sm font-medium mb-1">Unit (e.g., kg, piece, loaf)</label>
        <input 
          id="unit" 
          name="unit"
          defaultValue={product?.unit || ""}
          className="block w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">Price</label>
        <input 
          id="price" 
          name="price"
          type="number" 
          step="0.01" 
          defaultValue={product?.price || ""}
          required
          className="block w-full px-3 py-2 bg-background border border-input rounded-md text-sm"
        />
      </div>

      <button type="submit" disabled={isPending} className="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50">
        {isPending ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
