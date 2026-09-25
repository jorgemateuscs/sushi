export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          role: 'customer' | 'admin'
          created_at: string
          address_street: string | null
          address_number: string | null
          address_neighborhood: string | null
          address_reference: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          address_street?: string | null
          address_number?: string | null
          address_neighborhood?: string | null
          address_reference?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          address_street?: string | null
          address_number?: string | null
          address_neighborhood?: string | null
          address_reference?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          image_url: string | null
          is_available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          is_available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_available?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          delivery_address: string
          total_amount: number
          payment_method: string
          status: 'received' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          delivery_address: string
          total_amount: number
          payment_method: string
          status?: 'received' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_address?: string
          total_amount?: number
          payment_method?: string
          status?: 'received' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
          notes?: string | null
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
        }
      }
      cash_registers: {
        Row: {
          id: string
          opened_by: string | null
          opening_balance: number
          closing_balance: number | null
          status: 'open' | 'closed'
          opened_at: string
          closed_at: string | null
        }
        Insert: {
          id?: string
          opened_by?: string | null
          opening_balance: number
          closing_balance?: number | null
          status?: 'open' | 'closed'
          opened_at?: string
          closed_at?: string | null
        }
        Update: {
          id?: string
          opened_by?: string | null
          opening_balance?: number
          closing_balance?: number | null
          status?: 'open' | 'closed'
          opened_at?: string
          closed_at?: string | null
        }
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
  }
}
