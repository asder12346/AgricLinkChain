export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      buyers: {
        Row: {
          address: string | null
          business_name: string
          business_type: string | null
          contact_person: string | null
          created_at: string
          id: string
          location: string
          total_orders: number | null
          total_spend: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          business_name: string
          business_type?: string | null
          contact_person?: string | null
          created_at?: string
          id?: string
          location: string
          total_orders?: number | null
          total_spend?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          business_name?: string
          business_type?: string | null
          contact_person?: string | null
          created_at?: string
          id?: string
          location?: string
          total_orders?: number | null
          total_spend?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      farmers: {
        Row: {
          address: string | null
          average_rating: number | null
          created_at: string
          crops: string[] | null
          farm_description: string | null
          farm_name: string
          id: string
          location: string
          total_earnings: number | null
          total_sales: number | null
          updated_at: string
          user_id: string
          verification_documents: string[] | null
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
          created_at?: string
          crops?: string[] | null
          farm_description?: string | null
          farm_name: string
          id?: string
          location: string
          total_earnings?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id: string
          verification_documents?: string[] | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          address?: string | null
          average_rating?: number | null
          created_at?: string
          crops?: string[] | null
          farm_description?: string | null
          farm_name?: string
          id?: string
          location?: string
          total_earnings?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id?: string
          verification_documents?: string[] | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      listings: {
        Row: {
          available_quantity: number
          category: string | null
          created_at: string
          description: string | null
          farmer_id: string
          harvest_date: string | null
          id: string
          images: string[] | null
          price: number
          quantity: number
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          unit: string
          updated_at: string
        }
        Insert: {
          available_quantity: number
          category?: string | null
          created_at?: string
          description?: string | null
          farmer_id: string
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          price: number
          quantity: number
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          unit?: string
          updated_at?: string
        }
        Update: {
          available_quantity?: number
          category?: string | null
          created_at?: string
          description?: string | null
          farmer_id?: string
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          price?: number
          quantity?: number
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          accepted_at: string | null
          buyer_id: string
          created_at: string
          delivered_at: string | null
          delivery_address: string | null
          farmer_id: string
          id: string
          listing_id: string
          notes: string | null
          quantity: number
          shipped_at: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_price: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          buyer_id: string
          created_at?: string
          delivered_at?: string | null
          delivery_address?: string | null
          farmer_id: string
          id?: string
          listing_id: string
          notes?: string | null
          quantity: number
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_price: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          buyer_id?: string
          created_at?: string
          delivered_at?: string | null
          delivery_address?: string | null
          farmer_id?: string
          id?: string
          listing_id?: string
          notes?: string | null
          quantity?: number
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_price?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          order_id: string
          rating: number
          reviewed_buyer_id: string | null
          reviewed_farmer_id: string | null
          reviewer_id: string
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id: string
          rating: number
          reviewed_buyer_id?: string | null
          reviewed_farmer_id?: string | null
          reviewer_id: string
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id?: string
          rating?: number
          reviewed_buyer_id?: string | null
          reviewed_farmer_id?: string | null
          reviewer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewed_buyer_id_fkey"
            columns: ["reviewed_buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewed_farmer_id_fkey"
            columns: ["reviewed_farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          buyer_id: string
          completed_at: string | null
          created_at: string
          farmer_earnings: number
          farmer_id: string
          id: string
          order_id: string
          payment_method: string | null
          platform_fee: number | null
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_reference: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_id: string
          completed_at?: string | null
          created_at?: string
          farmer_earnings: number
          farmer_id: string
          id?: string
          order_id: string
          payment_method?: string | null
          platform_fee?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_reference?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          completed_at?: string | null
          created_at?: string
          farmer_earnings?: number
          farmer_id?: string
          id?: string
          order_id?: string
          payment_method?: string | null
          platform_fee?: number | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "buyers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_buyer_id_for_user: { Args: { _user_id: string }; Returns: string }
      get_farmer_id_for_user: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_buyer: { Args: never; Returns: boolean }
      is_farmer: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "farmer" | "buyer" | "admin"
      listing_status: "pending" | "approved" | "sold_out" | "rejected"
      order_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "shipped"
        | "delivered"
        | "cancelled"
      transaction_status: "pending" | "completed" | "failed" | "refunded"
      verification_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["farmer", "buyer", "admin"],
      listing_status: ["pending", "approved", "sold_out", "rejected"],
      order_status: [
        "pending",
        "accepted",
        "rejected",
        "shipped",
        "delivered",
        "cancelled",
      ],
      transaction_status: ["pending", "completed", "failed", "refunded"],
      verification_status: ["pending", "approved", "rejected"],
    },
  },
} as const
