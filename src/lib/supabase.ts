import { createBrowserClient, createServerClient } from '@supabase/ssr'

// Client-side Supabase client (para componentes 'use client')
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Função para criar client no servidor (só use em Server Components)
export function createServerSupabaseClient(cookieStore: any) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Types for our database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string
          origin: string
          destination: string
          start_date: string
          end_date: string
          budget: number
          budget_category: 'baixo' | 'medio' | 'alto'
          itinerary: unknown;
          weather_data: unknown;
          local_cuisine: unknown;
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          origin: string
          destination: string
          start_date: string
          end_date: string
          budget: number
          budget_category: 'baixo' | 'medio' | 'alto'
          itinerary?: unknown;
          weather_data?: unknown;
          local_cuisine?: unknown;
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          origin?: string
          destination?: string
          start_date?: string
          end_date?: string
          budget?: number
          budget_category?: 'baixo' | 'medio' | 'alto'
          itinerary?: unknown;
          weather_data?: unknown;
          local_cuisine?: unknown;
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}