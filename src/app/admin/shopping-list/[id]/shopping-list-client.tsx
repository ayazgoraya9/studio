
'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import type { FullShoppingList, ShoppingListItem } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { updateShoppingListItemStatus, savePurchase } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Share } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ShoppingListClientProps {
    serverList: FullShoppingList;
    productPriceMap: Map<string, number>;
}

export function ShoppingListClient({ serverList, productPriceMap }: ShoppingListClientProps) {
    const [list, setList] = useState(serverList);
    const [isSaving, startSaving] = useTransition();
    const { toast } = useToast();
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
        toast({ title: 'Link Copied!', description: 'Shopping list link copied to clipboard.' });
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
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            } else {
                toast({ title: 'List saved!', description: 'Purchase has been recorded in history.' });
                // We can redirect or update UI here
                router.push('/admin/stock-requests');
            }
        });
    };
    
    return (
        <div className="border bg-card text-card-foreground shadow-sm rounded-lg">
            <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold leading-none tracking-tight">{list.name}</h1>
                        <p className="text-sm text-muted-foreground">Check off items as you buy them. Updates are synced in real-time.</p>
                    </div>
                    <button onClick={handleShare} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"><Share className="mr-2 h-4 w-4"/> Share List</button>
                </div>
            </div>
            <div className="p-6 pt-0 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">To Buy ({uncheckedItems.length})</h3>
                    <div className="space-y-2">
                    {uncheckedItems.length > 0 ? uncheckedItems.map(item => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-background rounded-md border">
                            <input type="checkbox" id={item.id} checked={!!item.is_checked} onChange={(e) => handleCheckChange(item.id, e.target.checked)} className="h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
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
                                 <input type="checkbox" id={item.id} checked={!!item.is_checked} onChange={(e) => handleCheckChange(item.id, e.target.checked)} className="h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
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
                        <button onClick={handleFinishList} disabled={isSaving} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                           {isSaving ? 'Saving...' : 'Save Purchase & Finish'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
