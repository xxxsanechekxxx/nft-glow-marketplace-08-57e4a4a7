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
      nft_bids: {
        Row: {
          bid_amount: number
          bidder_address: string
          created_at: string | null
          id: string
          marketplace: string | null
          nft_id: string
          verified: boolean | null
        }
        Insert: {
          bid_amount: number
          bidder_address: string
          created_at?: string | null
          id?: string
          marketplace?: string | null
          nft_id: string
          verified?: boolean | null
        }
        Update: {
          bid_amount?: number
          bidder_address?: string
          created_at?: string | null
          id?: string
          marketplace?: string | null
          nft_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "nft_bids_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
        ]
      }
      nfts: {
        Row: {
          bidder_wallet_address: string | null
          created_at: string
          creator: string
          description: string | null
          for_sale: boolean | null
          id: string
          image: string
          marketplace: string | null
          name: string
          owner_id: string | null
          price: number
          properties: Json | null
        }
        Insert: {
          bidder_wallet_address?: string | null
          created_at?: string
          creator: string
          description?: string | null
          for_sale?: boolean | null
          id?: string
          image: string
          marketplace?: string | null
          name: string
          owner_id?: string | null
          price: number
          properties?: Json | null
        }
        Update: {
          bidder_wallet_address?: string | null
          created_at?: string
          creator?: string
          description?: string | null
          for_sale?: boolean | null
          id?: string
          image?: string
          marketplace?: string | null
          name?: string
          owner_id?: string | null
          price?: number
          properties?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number | null
          country: string | null
          created_at: string
          frozen_balance: number | null
          frozen_usdt_balance: number | null
          id: string
          kyc_address_doc: string | null
          kyc_identity_doc: string | null
          kyc_rejection_reason: string | null
          kyc_status: Database["public"]["Enums"]["kyc_status_type"] | null
          login: string
          usdt_balance: number | null
          user_id: string
          verified: boolean
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          balance?: number | null
          country?: string | null
          created_at?: string
          frozen_balance?: number | null
          frozen_usdt_balance?: number | null
          id?: string
          kyc_address_doc?: string | null
          kyc_identity_doc?: string | null
          kyc_rejection_reason?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status_type"] | null
          login: string
          usdt_balance?: number | null
          user_id: string
          verified?: boolean
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          balance?: number | null
          country?: string | null
          created_at?: string
          frozen_balance?: number | null
          frozen_usdt_balance?: number | null
          id?: string
          kyc_address_doc?: string | null
          kyc_identity_doc?: string | null
          kyc_rejection_reason?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status_type"] | null
          login?: string
          usdt_balance?: number | null
          user_id?: string
          verified?: boolean
          wallet_address?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency_type: string | null
          frozen_until: string | null
          id: string
          is_frozen: boolean | null
          is_frozen_exchange: boolean | null
          item: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency_type?: string | null
          frozen_until?: string | null
          id?: string
          is_frozen?: boolean | null
          is_frozen_exchange?: boolean | null
          item?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency_type?: string | null
          frozen_until?: string | null
          id?: string
          is_frozen?: boolean | null
          is_frozen_exchange?: boolean | null
          item?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_bid: {
        Args: { bid_id: string }
        Returns: Json
      }
      exchange_to_usdt: {
        Args: { amount: number }
        Returns: Json
      }
      get_user_frozen_balances: {
        Args: { user_uuid: string }
        Returns: {
          frozen_balance: number
          frozen_usdt_balance: number
          unfreezing_in_days: Json[]
        }[]
      }
      get_user_transaction_totals: {
        Args: { user_uuid: string }
        Returns: {
          total_deposits: number
          total_withdrawals: number
        }[]
      }
      process_frozen_balances: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      purchase_nft: {
        Args: { nft_id: string }
        Returns: Json
      }
      update_frozen_transaction_currency: {
        Args: { transaction_id: string; new_currency_type: string }
        Returns: Json
      }
    }
    Enums: {
      kyc_status_type:
        | "not_started"
        | "identity_submitted"
        | "address_submitted"
        | "under_review"
        | "verified"
        | "rejected"
      transaction_status: "pending" | "completed" | "failed"
      transaction_type:
        | "deposit"
        | "withdraw"
        | "purchase"
        | "sale"
        | "exchange"
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
      kyc_status_type: [
        "not_started",
        "identity_submitted",
        "address_submitted",
        "under_review",
        "verified",
        "rejected",
      ],
      transaction_status: ["pending", "completed", "failed"],
      transaction_type: ["deposit", "withdraw", "purchase", "sale", "exchange"],
    },
  },
} as const
