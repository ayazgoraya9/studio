export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      daily_reports: {
        Row: {
          created_at: string | null
          id: string
          salesman_name: string
          shop_name: string
          total_expenses: number
          total_sales: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          salesman_name: string
          shop_name: string
          total_expenses: number
          total_sales: number
        }
        Update: {
          created_at?: string | null
          id?: string
          salesman_name?: string
          shop_name?: string
          total_expenses?: number
          total_sales?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          id: string
          name: string
          price: number
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          price: number
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          price?: number
          unit?: string | null
        }
        Relationships: []
      }
      purchasing_history: {
        Row: {
          id: string
          list_id: string | null
          purchase_date: string | null
          total_cost: number
        }
        Insert: {
          id?: string
          list_id?: string | null
          purchase_date?: string | null
          total_cost: number
        }
        Update: {
          id?: string
          list_id?: string | null
          purchase_date?: string | null
          total_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchasing_history_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_list_items: {
        Row: {
          id: string
          is_checked: boolean | null
          list_id: string | null
          product_id: string | null
          product_name: string
          product_unit: string | null
          quantity: number
        }
        Insert: {
          id?: string
          is_checked?: boolean | null
          list_id?: string | null
          product_id?: string | null
          product_name: string
          product_unit?: string | null
          quantity: number
        }
        Update: {
          id?: string
          is_checked?: boolean | null
          list_id?: string | null
          product_id?: string | null
          product_name?: string
          product_unit?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string | null
          id: string
          name: string
          total_cost: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          total_cost?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          total_cost?: number | null
        }
        Relationships: []
      }
      stock_request_items: {
        Row: {
          id: string
          product_id: string | null
          quantity: number
          request_id: string | null
        }
        Insert: {
          id?: string
          product_id?: string | null
          quantity: number
          request_id?: string | null
        }
        Update: {
          id?: string
          product_id?: string | null
          quantity?: number
          request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_request_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_request_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "stock_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_requests: {
        Row: {
          created_at: string | null
          id: string
          is_merged: boolean | null
          shop_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_merged?: boolean | null
          shop_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_merged?: boolean | null
          shop_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
