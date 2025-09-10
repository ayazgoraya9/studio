
'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import type { FullShoppingList, ShoppingListItem } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { updateShoppingListItemStatus, savePurchase } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface ShoppingListClientProps {
    serverList: FullShoppingList;
    productPriceMap: Map<string, number>;
}

export function ShoppingListClient({ serverList, productPriceMap }: ShoppingListClientProps) {
    const [list, setList] = useState(serverList);
    const [isSaving, startSaving] = useTransition();
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const channel = supabase
            .channel(`shopping-list-${list.id}`)
            .on<ShoppingListItem>(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'shopping_list_items', filter: `list_id=eq.${list.id}` },
                (payload) => {
                    setList(currentList => ({
                        ...currentList,
                        shopping_list_items: currentList.shopping_list_items.map(item =>
                            item.id === payload.new.id ? payload.new : item
                        ),
                    }));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [list.id, supabase]);

    const handleCheckChange = (itemId: string, isChecked: boolean) => {
        // Optimistic update
        setList(currentList => ({
            ...currentList,
            shopping_list_items: currentList.shopping_list_items.map(item =>
                item.id === itemId ? { ...item, is_checked: isChecked } : item
            ),
        }));
        // Fire and forget server action
        updateShoppingListItemStatus(itemId, isChecked);
    };
    
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link Copied! Shopping list link copied to clipboard.');
    };

    const uncheckedItems = list.shopping_list_items.filter(item => !item.is_checked);
    const checkedItems = list.shopping_list_items.filter(item => item.is_checked);

    const allItemsChecked = uncheckedItems.length === 0;

    const totalCost = useMemo(() => {
        return list.shopping_list_items.reduce((total, item) => {
            const price = item.product_id ? productPriceMap.get(item.product_id) || 0 : 0;
            return total + (price * item.quantity);
        }, 0);
    }, [list.shopping_list_items, productPriceMap]);

    const handleFinishList = () => {
        startSaving(async () => {
            const result = await savePurchase(list.id, totalCost);
            if (result?.error) {
                alert('Error: ' + result.error);
            } else {
                alert('List saved! Purchase has been recorded.');
                router.push('/admin/stock-requests');
            }
        });
    };
    
    return (
        <div className="border bg-card text-card-foreground shadow-sm rounded-lg">
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold">{list.name}</h1>
                        <p className="text-sm text-muted-foreground">Check off items as you buy them. Updates are synced in real-time.</p>
                    </div>
                    <button onClick={handleShare} className="px-4 py-2 text-sm font-medium border border-input bg-background rounded-md hover:bg-accent">Share List</button>
                </div>
            </div>
            <div className="p-6 pt-0 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">To Buy ({uncheckedItems.length})</h3>
                    <div className="space-y-2">
                    {uncheckedItems.length > 0 ? uncheckedItems.map(item => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-background rounded-md border">
                            <input type="checkbox" id={item.id} checked={!!item.is_checked} onChange={(e) => handleCheckChange(item.id, e.target.checked)} className="h-4 w-4 shrink-0 rounded-sm border-primary" />
                            <label htmlFor={item.id} className="text-base flex-1 cursor-pointer">
                                {item.product_name} - <span className="font-bold">{item.quantity} {item.product_unit}</span>
                            </label>
                        </div>
                    )) : <p className="text-muted-foreground text-center p-4">All items purchased!</p>}
                    </div>
                </div>

                {checkedItems.length > 0 && (
                     <div>
                        <h3 className="text-lg font-semibold mb-2">Purchased ({checkedItems.length})</h3>
                        <div className="space-y-2">
                        {checkedItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md border">
                                 <input type="checkbox" id={item.id} checked={!!item.is_checked} onChange={(e) => handleCheckChange(item.id, e.target.checked)} className="h-4 w-4 shrink-0 rounded-sm border-primary" />
                                <label htmlFor={item.id} className="text-base flex-1 line-through text-muted-foreground cursor-pointer">
                                    {item.product_name} - <span className="font-bold">{item.quantity} {item.product_unit}</span>
                                </label>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </div>
            {allItemsChecked && (
                <div className="p-6 pt-0 border-t mt-6">
                    <div className="flex justify-between items-center mt-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Estimated Total Cost</p>
                            <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
                        </div>
                        <button onClick={handleFinishList} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50">
                           {isSaving ? 'Saving...' : 'Save Purchase & Finish'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
