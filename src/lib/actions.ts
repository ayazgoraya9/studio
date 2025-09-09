// src/lib/actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { NewDailyReport, NewStockRequest, NewStockRequestItem } from './types';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  unit: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive'),
});

export async function upsertProduct(productData: z.infer<typeof productSchema>) {
  const supabase = createClient();
  
  const validation = productSchema.safeParse(productData);
  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  const { id, ...data } = validation.data;
  
  const { error } = await supabase.from('products').upsert({ id: id || undefined, ...data });

  if (error) {
    return { error: { _form: [error.message] } };
  }

  revalidatePath('/admin/products');
  revalidatePath('/employee/products');
  return { error: null };
}

const reportSchema = z.object({
    shop_name: z.string().min(1, 'Shop name is required'),
    salesman_name: z.string().min(1, 'Salesman name is required'),
    total_sales: z.coerce.number().min(0, 'Total sales cannot be negative'),
    total_expenses: z.coerce.number().min(0, 'Total expenses cannot be negative'),
});

export async function submitDailyReport(data: z.infer<typeof reportSchema>) {
    const supabase = createClient();

    const validation = reportSchema.safeParse(data);
    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors };
    }

    const { error } = await supabase.from('daily_reports').insert(validation.data as NewDailyReport);

    if (error) {
        return { error: { _form: [error.message] } };
    }

    revalidatePath('/employee/daily-report');
    revalidatePath('/admin/reports');
    return { error: null };
}

const stockRequestSchema = z.object({
  shop_name: z.string().min(1, 'Shop name is required'),
  items: z.array(z.object({
    product_id: z.string(),
    quantity: z.coerce.number().int().positive(),
  })).min(1, 'At least one item is required'),
});

export async function submitStockRequest(data: z.infer<typeof stockRequestSchema>) {
    const supabase = createClient();

    const validation = stockRequestSchema.safeParse(data);
    if (!validation.success) {
        return { error: 'Invalid data. Please check your inputs.' };
    }

    const { shop_name, items } = validation.data;

    const { data: request, error: requestError } = await supabase.from('stock_requests').insert({ shop_name } as NewStockRequest).select().single();
    if (requestError || !request) {
        return { error: requestError?.message || 'Failed to create stock request' };
    }

    const requestItems: NewStockRequestItem[] = items.map(item => ({
        request_id: request.id,
        product_id: item.product_id,
        quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase.from('stock_request_items').insert(requestItems);
    if (itemsError) {
        await supabase.from('stock_requests').delete().eq('id', request.id);
        return { error: itemsError.message };
    }

    revalidatePath('/employee/stock-request');
    revalidatePath('/admin/stock-requests');
    return { error: null };
}

export async function mergeStockRequests(shopName: string, requestIds: string[]) {
    const supabase = createClient();

    const { data: items, error: itemsError } = await supabase
        .from('stock_request_items')
        .select('*, products(id, name, unit)')
        .in('request_id', requestIds);

    if (itemsError || !items) {
        return { error: 'Could not fetch items for merging.' };
    }
    
    const productQuantities = new Map<string, { product: any, quantity: number }>();
    for (const item of items) {
        if (item.products) {
            const existing = productQuantities.get(item.products.id);
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                productQuantities.set(item.products.id, { product: item.products, quantity: item.quantity });
            }
        }
    }

    const listName = `${shopName} Shopping List - ${new Date().toLocaleDateString()}`;
    const { data: shoppingList, error: listError } = await supabase.from('shopping_lists').insert({ name: listName }).select().single();

    if (listError || !shoppingList) {
        return { error: 'Could not create shopping list.' };
    }

    const shoppingListItems = Array.from(productQuantities.values()).map(({ product, quantity }) => ({
        list_id: shoppingList.id,
        product_id: product.id,
        product_name: product.name,
        product_unit: product.unit,
        quantity: quantity,
    }));

    const { error: listItemsError } = await supabase.from('shopping_list_items').insert(shoppingListItems);
    if (listItemsError) {
        return { error: 'Could not add items to shopping list.' };
    }

    const { error: updateError } = await supabase.from('stock_requests').update({ is_merged: true }).in('id', requestIds);
    if(updateError) {
        console.error('Failed to mark requests as merged:', updateError);
    }

    revalidatePath('/admin/stock-requests');
    redirect(`/admin/shopping-list/${shoppingList.id}`);
}

export async function updateShoppingListItemStatus(itemId: string, isChecked: boolean) {
    const supabase = createClient();
    const { error } = await supabase.from('shopping_list_items').update({ is_checked: isChecked }).eq('id', itemId);

    if(error) return { error: error.message };
    
    return { error: null };
}

export async function savePurchase(listId: string, totalCost: number) {
    const supabase = createClient();
    
    const { error: listUpdateError } = await supabase.from('shopping_lists').update({ total_cost: totalCost }).eq('id', listId);
    if(listUpdateError) return { error: listUpdateError.message };

    // ================== THE BUG FIX IS HERE ==================
    // 1. Explicitly set the purchase_date to the current time to avoid nulls.
    // 2. Your schema will handle the timezone conversion.
    const purchaseData = { 
      list_id: listId, 
      total_cost: totalCost,
      purchase_date: new Date().toISOString(),
    };

    const { error: historyError } = await supabase.from('purchasing_history').insert(purchaseData);
    if(historyError) return { error: historyError.message };

    // 3. Revalidate BOTH the shopping list and the purchasing history page.
    revalidatePath(`/admin/shopping-list/${listId}`);
    revalidatePath('/admin/purchasing-history'); // THIS LINE FIXES THE BUG
    // =======================================================

    return { error: null };
}