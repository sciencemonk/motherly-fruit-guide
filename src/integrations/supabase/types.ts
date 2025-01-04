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
      chat_history: {
        Row: {
          content: string
          created_at: string
          id: string
          phone_number: string
          role: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          phone_number: string
          role: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          phone_number?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profile"
            columns: ["phone_number"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["phone_number"]
          },
        ]
      }
      message_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          phone_number: string
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          phone_number: string
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          phone_number?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profile"
            columns: ["phone_number"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["phone_number"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          due_date: string | null
          fertility_report_type: string | null
          first_name: string | null
          id: string
          interests: string | null
          is_premium: boolean | null
          last_period: string | null
          last_sign_in: string | null
          lifestyle: string | null
          login_code: string
          next_billing_date: string | null
          phone_number: string
          preferred_notification_time: string | null
          pregnancy_status: string | null
          state: string | null
          subscription_id: string | null
          subscription_status: string | null
          subscription_type: string | null
          trial_ends_at: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          due_date?: string | null
          fertility_report_type?: string | null
          first_name?: string | null
          id?: string
          interests?: string | null
          is_premium?: boolean | null
          last_period?: string | null
          last_sign_in?: string | null
          lifestyle?: string | null
          login_code: string
          next_billing_date?: string | null
          phone_number: string
          preferred_notification_time?: string | null
          pregnancy_status?: string | null
          state?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          subscription_type?: string | null
          trial_ends_at?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          due_date?: string | null
          fertility_report_type?: string | null
          first_name?: string | null
          id?: string
          interests?: string | null
          is_premium?: boolean | null
          last_period?: string | null
          last_sign_in?: string | null
          lifestyle?: string | null
          login_code?: string
          next_billing_date?: string | null
          phone_number?: string
          preferred_notification_time?: string | null
          pregnancy_status?: string | null
          state?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          subscription_type?: string | null
          trial_ends_at?: string | null
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          value?: string
        }
        Relationships: []
      }
      verification_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: string
          phone_number: string
          used: boolean | null
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          id?: string
          phone_number: string
          used?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          phone_number?: string
          used?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_alphanumeric_code: {
        Args: {
          length: number
        }
        Returns: string
      }
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
