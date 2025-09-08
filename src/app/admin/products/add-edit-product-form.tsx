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
import { useEffect } from "react";
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
  const [state, formAction] = useFormState(upsertProduct, { error: null });
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: product?.id,
      name: product?.name || "",
      unit: product?.unit || "",
      price: product?.price || 0,
    },
  });

  useEffect(() => {
    if (state.error) {
      // Handle server-side errors
      toast({
        variant: "destructive",
        title: "Error",
        description: Object.values(state.error).flat().join("\n"),
      });
    } else if (state.error === null) {
      toast({
        title: "Success",
        description: `Product ${product ? "updated" : "added"} successfully.`,
      });
      onSuccess();
    }
  }, [state, product, onSuccess, toast]);

  useEffect(() => {
    reset({
      id: product?.id,
      name: product?.name || "",
      unit: product?.unit || "",
      price: product?.price || 0,
    });
  }, [product, reset]);

  return (
    <form action={formAction} className="space-y-4">
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
      
      {state.error?._form && (
        <p className="text-destructive text-sm">{state.error._form.join(", ")}</p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}
