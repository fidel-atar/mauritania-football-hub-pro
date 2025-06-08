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
      admin_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["admin_role"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"] | null
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_cart_items_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      cup_matches: {
        Row: {
          away_score: number | null
          away_team_id: string | null
          created_at: string
          cup_id: string
          home_score: number | null
          home_team_id: string | null
          id: string
          is_played: boolean
          match_date: string | null
          match_number: number
          round: number
          updated_at: string
          winner_team_id: string | null
        }
        Insert: {
          away_score?: number | null
          away_team_id?: string | null
          created_at?: string
          cup_id: string
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          is_played?: boolean
          match_date?: string | null
          match_number: number
          round: number
          updated_at?: string
          winner_team_id?: string | null
        }
        Update: {
          away_score?: number | null
          away_team_id?: string | null
          created_at?: string
          cup_id?: string
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          is_played?: boolean
          match_date?: string | null
          match_number?: number
          round?: number
          updated_at?: string
          winner_team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cup_matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cup_matches_cup_id_fkey"
            columns: ["cup_id"]
            isOneToOne: false
            referencedRelation: "cups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cup_matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cup_matches_winner_team_id_fkey"
            columns: ["winner_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      cups: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          prize_money: number | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          prize_money?: number | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          prize_money?: number | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      match_events: {
        Row: {
          created_at: string
          description: string | null
          event_type: string
          id: string
          match_id: string
          minute: number
          player_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_type: string
          id?: string
          match_id: string
          minute: number
          player_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_type?: string
          id?: string
          match_id?: string
          minute?: number
          player_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_events_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_score: number | null
          away_team_id: string | null
          created_at: string | null
          home_score: number | null
          home_team_id: string | null
          id: string
          match_date: string
          stadium: string
          status: Database["public"]["Enums"]["match_status"] | null
          updated_at: string | null
        }
        Insert: {
          away_score?: number | null
          away_team_id?: string | null
          created_at?: string | null
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          match_date: string
          stadium: string
          status?: Database["public"]["Enums"]["match_status"] | null
          updated_at?: string | null
        }
        Update: {
          away_score?: number | null
          away_team_id?: string | null
          created_at?: string | null
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          match_date?: string
          stadium?: string
          status?: Database["public"]["Enums"]["match_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author: string | null
          category: string
          content: string
          created_at: string | null
          id: string
          image: string | null
          published: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category: string
          content: string
          created_at?: string | null
          id?: string
          image?: string | null
          published?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          image?: string | null
          published?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          news_id: string
          parent_comment_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          news_id: string
          parent_comment_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          news_id?: string
          parent_comment_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_news_comments_news"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_news_comments_parent"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "news_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      news_reactions: {
        Row: {
          created_at: string
          id: string
          news_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          news_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          news_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_news_reactions_news"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_at_time: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_at_time: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_at_time?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_items_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_order_items_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          payment_method: string
          payment_reference: string | null
          phone_number: string
          shipping_address: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_method?: string
          payment_reference?: string | null
          phone_number: string
          shipping_address: string
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_method?: string
          payment_reference?: string | null
          phone_number?: string
          shipping_address?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          age: number
          assists: number | null
          created_at: string | null
          goals: number | null
          id: string
          image: string | null
          matches: number | null
          name: string
          nationality: string
          number: number
          position: string
          red_cards: number | null
          team_id: string | null
          updated_at: string | null
          yellow_cards: number | null
        }
        Insert: {
          age: number
          assists?: number | null
          created_at?: string | null
          goals?: number | null
          id?: string
          image?: string | null
          matches?: number | null
          name: string
          nationality: string
          number: number
          position: string
          red_cards?: number | null
          team_id?: string | null
          updated_at?: string | null
          yellow_cards?: number | null
        }
        Update: {
          age?: number
          assists?: number | null
          created_at?: string | null
          goals?: number | null
          id?: string
          image?: string | null
          matches?: number | null
          name?: string
          nationality?: string
          number?: number
          position?: string
          red_cards?: number | null
          team_id?: string | null
          updated_at?: string | null
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          in_stock: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          in_stock?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          in_stock?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      standings: {
        Row: {
          created_at: string | null
          draws: number | null
          goal_difference: number | null
          goals_against: number | null
          goals_for: number | null
          id: string
          losses: number | null
          matches_played: number | null
          points: number | null
          position: number
          season: string | null
          team_id: string | null
          updated_at: string | null
          wins: number | null
        }
        Insert: {
          created_at?: string | null
          draws?: number | null
          goal_difference?: number | null
          goals_against?: number | null
          goals_for?: number | null
          id?: string
          losses?: number | null
          matches_played?: number | null
          points?: number | null
          position: number
          season?: string | null
          team_id?: string | null
          updated_at?: string | null
          wins?: number | null
        }
        Update: {
          created_at?: string | null
          draws?: number | null
          goal_difference?: number | null
          goals_against?: number | null
          goals_for?: number | null
          id?: string
          losses?: number | null
          matches_played?: number | null
          points?: number | null
          position?: number
          season?: string | null
          team_id?: string | null
          updated_at?: string | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          coach: string | null
          created_at: string | null
          description: string | null
          founded_year: number | null
          id: string
          logo: string | null
          name: string
          stadium: string | null
          updated_at: string | null
        }
        Insert: {
          coach?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string
          logo?: string | null
          name: string
          stadium?: string | null
          updated_at?: string | null
        }
        Update: {
          coach?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string
          logo?: string | null
          name?: string
          stadium?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never> | { user_id?: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "moderator"
      match_status: "scheduled" | "live" | "finished"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["super_admin", "admin", "moderator"],
      match_status: ["scheduled", "live", "finished"],
    },
  },
} as const
