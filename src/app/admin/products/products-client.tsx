// src/app/admin/products/products-client.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Edit, PlusCircle } from "lucide-react";
import type { Product } from "@/lib/types";
import { AddEditProductForm } from "./add-edit-product-form";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductsClientProps {
  serverProducts: Product[];
}

export function ProductsClient({ serverProducts }: ProductsClientProps) {
  const [products, setProducts] = useState(serverProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
                setProducts(current => [payload.new as Product, ...current]);
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };
  
  const onFormSuccess = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  }

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <CardTitle>Manage Products</CardTitle>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct 
                  ? "Update the details for this product." 
                  : "Fill in the form below to create a new product."}
              </DialogDescription>
            </DialogHeader>
            <AddEditProductForm
              product={editingProduct}
              onSuccess={onFormSuccess}
            />
          </DialogContent>
        </Dialog>

      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                  <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="w-[80px] text-center">Actions</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {products.map((product) => (
                  <TableRow key={product.id}>
                      <TableCell className="font-medium whitespace-nowrap">{product.name}</TableCell>
                      <TableCell className="whitespace-nowrap">{product.unit}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                      ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                      <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                      >
                          <Edit className="h-4 w-4" />
                      </Button>
                      </TableCell>
                  </TableRow>
                  ))}
              </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}