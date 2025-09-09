import type { Database } from './database.types';

export type Product = Database['public']['Tables']['products']['Row'];
export type NewProduct = Database['public']['Tables']['products']['Insert'];

export type DailyReport = Database['public']['Tables']['daily_reports']['Row'];
export type NewDailyReport = Database['public']['Tables']['daily_reports']['Insert'];

export type StockRequest = Database['public']['Tables']['stock_requests']['Row'];
export type NewStockRequest = Database['public']['Tables']['stock_requests']['Insert'];

export type StockRequestItem = Database['public']['Tables']['stock_request_items']['Row'];
export type NewStockRequestItem = Database['public']['Tables']['stock_request_items']['Insert'];

export type FullStockRequest = StockRequest & {
  stock_request_items: (StockRequestItem & {
    products: Product | null;
  })[];
};

export type ShoppingList = Database['public']['Tables']['shopping_lists']['Row'];
export type NewShoppingList = Database['public']['Tables']['shopping_lists']['Insert'];

export type ShoppingListItem = Database['public']['Tables']['shopping_list_items']['Row'];
export type NewShoppingListItem = Database['public']['Tables']['shopping_list_items']['Insert'];

export type FullShoppingList = ShoppingList & {
  shopping_list_items: ShoppingListItem[];
};
