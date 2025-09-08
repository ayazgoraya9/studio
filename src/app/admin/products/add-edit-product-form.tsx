"use client";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upsertProduct } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Product } from "@/lib/types";
import { useEffect, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Product name is required"),
  unit: z.string().optional(),
  price: z.coerce.number().positive("Price must be a positive number"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface AddEditProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
}

export function AddEditProductForm({ product, onSuccess }: AddEditProductFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: product?.id,
      name: product?.name || "",
      unit: product?.unit || "",
      price: product?.price || 0,
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    startTransition(async () => {
      const result = await upsertProduct(data);
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
        onSuccess();
      }
    })
  }

  useEffect(() => {
    reset({
      id: product?.id,
      name: product?.name || "",
      unit: product?.unit || "",
      price: product?.price || 0,
    });
  }, [product, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {product && <input type="hidden" {...register("id")} />}
      
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="unit">Unit (e.g., kg, piece, loaf)</Label>
        <Input id="unit" {...register("unit")} />
        {errors.unit && (
          <p className="text-destructive text-sm mt-1">{errors.unit.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" step="0.01" {...register("price")} />
        {errors.price && (
          <p className="text-destructive text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}
