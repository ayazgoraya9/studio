'use client';

import { useState, useEffect, useTransition } from 'react';
import type { FullShoppingList, ShoppingListItem } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { savePurchase, updateShoppingListItemStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Clipboard, Share } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ShoppingListClientProps {
    serverList: FullShoppingList;
}

export function ShoppingListClient({ serverList }: ShoppingListClientProps) {
    const [list, setList] = useState(serverList);
    const [isPending, startTransition] = useTransition();
    const [totalCost, setTotalCost] = useState<number | ''>('');
    const { toast } = useToast();
    const supabase = createClient();

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
        startTransition(async () => {
            await updateShoppingListItemStatus(itemId, isChecked);
        });
    };
    
    const handleSavePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof totalCost !== 'number' || totalCost <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Cost', description: 'Please enter a valid total cost.' });
            return;
        }

        startTransition(async () => {
            const result = await savePurchase(list.id, totalCost);
            if (result.error) {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            } else {
                toast({ title: 'Success', description: 'Purchase saved successfully.' });
                 setList(currentList => ({ ...currentList, total_cost: totalCost }));
            }
        });
    };
    
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: 'Link Copied!', description: 'Shopping list link copied to clipboard.' });
    };

    const uncheckedItems = list.shopping_list_items.filter(item => !item.is_checked);
    const checkedItems = list.shopping_list_items.filter(item => item.is_checked);
    
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-2xl">{list.name}</CardTitle>
                        <CardDescription>Check off items as you buy them. Updates are synced in real-time.</CardDescription>
                    </div>
                    {list.total_cost ? (
                        <Badge variant="secondary" className="text-lg whitespace-nowrap">Total Cost: ${list.total_cost.toFixed(2)}</Badge>
                    ) : (
                        <Button variant="outline" onClick={handleShare}><Share className="mr-2 h-4 w-4"/> Share List</Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">To Buy ({uncheckedItems.length})</h3>
                    <div className="space-y-2">
                    {uncheckedItems.length > 0 ? uncheckedItems.map(item => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-background rounded-md border animate-in fade-in-20">
                            <Checkbox id={item.id} checked={!!item.is_checked} onCheckedChange={(checked) => handleCheckChange(item.id, !!checked)} />
                            <Label htmlFor={item.id} className="text-base flex-1 cursor-pointer">
                                {item.product_name} - <span className="font-bold">{item.quantity} {item.product_unit}</span>
                            </Label>
                        </div>
                    )) : <p className="text-muted-foreground text-center p-4">All items purchased!</p>}
                    </div>
                </div>

                {checkedItems.length > 0 && (
                     <div>
                        <h3 className="text-lg font-semibold mb-2">Purchased ({checkedItems.length})</h3>
                        <div className="space-y-2">
                        {checkedItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md border animate-in fade-in-20">
                                <Checkbox id={item.id} checked={!!item.is_checked} onCheckedChange={(checked) => handleCheckChange(item.id, !!checked)} />
                                <Label htmlFor={item.id} className="text-base flex-1 line-through text-muted-foreground cursor-pointer">
                                    {item.product_name} - <span className="font-bold">{item.quantity} {item.product_unit}</span>
                                </Label>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </CardContent>
            {!list.total_cost && (
                <CardFooter>
                    <form onSubmit={handleSavePurchase} className="w-full flex flex-col md:flex-row items-center md:items-end gap-4 p-4 border rounded-lg bg-secondary/30">
                        <div className="flex-1 w-full">
                            <Label htmlFor="total_cost" className="font-semibold">Enter Total Purchase Cost</Label>
                            <Input 
                                id="total_cost"
                                type="number" 
                                step="0.01"
                                placeholder="e.g., 123.45"
                                value={totalCost}
                                onChange={e => setTotalCost(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                className="mt-1"
                            />
                        </div>
                        <Button type="submit" disabled={isPending} className="w-full md:w-auto">{isPending ? 'Saving...' : 'Save Purchase'}</Button>
                    </form>
                </CardFooter>
            )}
        </Card>
    );
}
