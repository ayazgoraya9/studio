'use client';

import { useTransition } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitStockRequest } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, PlusCircle, Minus, Trash2 } from 'lucide-react';
import type { Product } from '@/lib/types';

const stockRequestSchema = z.object({
  shop_name: z.string().min(1, 'Shop name is required'),
  items: z.array(z.object({
    product_id: z.string().min(1, 'Product must be selected'),
    quantity: z.coerce.number().int().positive('Boxes must be a positive number'),
  })).min(1, 'At least one item is required for a stock request.'),
});

type StockRequestFormValues = z.infer<typeof stockRequestSchema>;

interface StockRequestFormProps {
  products: Pick<Product, 'id' | 'name' | 'unit'>[];
}

export function StockRequestForm({ products }: StockRequestFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm<StockRequestFormValues>({
    resolver: zodResolver(stockRequestSchema),
    defaultValues: {
      shop_name: '',
      items: [{ product_id: '', quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data: StockRequestFormValues) => {
    startTransition(async () => {
        const result = await submitStockRequest(data);
        if (result?.error) {
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: result.error,
            });
        } else {
            toast({
                title: 'Success',
                description: 'Your stock request has been submitted.',
            });
            reset();
        }
    });
  };

  const selectedProducts = watch('items').map(item => item.product_id);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="shop_name">Shop Name</Label>
        <Input id="shop_name" {...register('shop_name')} />
        {errors.shop_name && <p className="text-sm text-destructive">{errors.shop_name.message}</p>}
      </div>

      <div className="space-y-4">
        <Label>Request Items</Label>
        {fields.map((field, index) => {
          const currentProductId = watch(`items.${index}.product_id`);
          const currentQuantity = watch(`items.${index}.quantity`);
          const availableProducts = products.filter(p => !selectedProducts.includes(p.id) || p.id === currentProductId);

          const handleQuantityChange = (delta: number) => {
            const newValue = (currentQuantity || 0) + delta;
            if (newValue >= 1) {
              setValue(`items.${index}.quantity`, newValue, { shouldValidate: true });
            }
          };

          return (
            <div key={field.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 border rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="space-y-2">
                      <Label>Product</Label>
                      <Select
                          onValueChange={(value) => setValue(`items.${index}.product_id`, value)}
                          defaultValue={field.product_id}
                          value={currentProductId}
                      >
                          <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                              {availableProducts.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                      {errors.items?.[index]?.product_id && <p className="text-sm text-destructive">{errors.items[index].product_id.message}</p>}
                  </div>
                   <div className="space-y-2">
                      <Label>Boxes</Label>
                       <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={currentQuantity <= 1}>
                              <Minus className="h-4 w-4" />
                          </Button>
                          <Input 
                              type="number"
                              className="w-16 text-center"
                              {...register(`items.${index}.quantity`)}
                              min="1"
                          />
                          <Button type="button" variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                              <Plus className="h-4 w-4" />
                          </Button>
                      </div>
                      {errors.items?.[index]?.quantity && <p className="text-sm text-destructive">{errors.items[index].quantity.message}</p>}
                  </div>
              </div>
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="mt-8 sm:mt-6 flex-shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        })}
        {errors.items?.root && <p className="text-sm text-destructive">{errors.items.root.message}</p>}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button type="button" variant="outline" onClick={() => append({ product_id: '', quantity: 1 })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>
        <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit Stock Request'}
        </Button>
      </div>
    </form>
  );
}
