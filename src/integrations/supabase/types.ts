export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_queries: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          question: string
          thumbs_up: boolean | null
          user_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          question: string
          thumbs_up?: boolean | null
          user_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          question?: string
          thumbs_up?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_queries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      flags: {
        Row: {
          created_at: string | null
          id: string
          reason: string | null
          upload_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason?: string | null
          upload_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string | null
          upload_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flags_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_official: boolean
          name: string
          telegram_link: string | null
          university: string | null
          whatsapp_link: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_official?: boolean
          name: string
          telegram_link?: string | null
          university?: string | null
          whatsapp_link?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_official?: boolean
          name?: string
          telegram_link?: string | null
          university?: string | null
          whatsapp_link?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      uploads: {
        Row: {
          company_name: string | null
          company_role: string | null
          course: string
          created_at: string | null
          creator_name: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["upload_difficulty"] | null
          external_link: string | null
          file_path: string | null
          flags: number | null
          id: string
          is_hidden: boolean | null
          platform: string | null
          subject: string
          title: string
          type: Database["public"]["Enums"]["upload_type"]
          university: string | null
          updated_at: string | null
          user_id: string
          votes: number | null
        }
        Insert: {
          company_name?: string | null
          company_role?: string | null
          course: string
          created_at?: string | null
          creator_name?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["upload_difficulty"] | null
          external_link?: string | null
          file_path?: string | null
          flags?: number | null
          id?: string
          is_hidden?: boolean | null
          platform?: string | null
          subject: string
          title: string
          type: Database["public"]["Enums"]["upload_type"]
          university?: string | null
          updated_at?: string | null
          user_id: string
          votes?: number | null
        }
        Update: {
          company_name?: string | null
          company_role?: string | null
          course?: string
          created_at?: string | null
          creator_name?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["upload_difficulty"] | null
          external_link?: string | null
          file_path?: string | null
          flags?: number | null
          id?: string
          is_hidden?: boolean | null
          platform?: string | null
          subject?: string
          title?: string
          type?: Database["public"]["Enums"]["upload_type"]
          university?: string | null
          updated_at?: string | null
          user_id?: string
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          awarded_at: string | null
          badge_type: Database["public"]["Enums"]["badge_type"]
          description: string | null
          icon: string | null
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string | null
          badge_type: Database["public"]["Enums"]["badge_type"]
          description?: string | null
          icon?: string | null
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string | null
          badge_type?: Database["public"]["Enums"]["badge_type"]
          description?: string | null
          icon?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          badge_level: number | null
          created_at: string | null
          email: string
          id: string
          is_admin: boolean
          is_upi_public: boolean
          last_upload_date: string | null
          name: string
          total_uploads: number | null
          total_votes: number | null
          updated_at: string | null
          upi_link: string | null
          upload_streak: number | null
          username: string | null
        }
        Insert: {
          badge_level?: number | null
          created_at?: string | null
          email: string
          id: string
          is_admin?: boolean
          is_upi_public?: boolean
          last_upload_date?: string | null
          name: string
          total_uploads?: number | null
          total_votes?: number | null
          updated_at?: string | null
          upi_link?: string | null
          upload_streak?: number | null
          username?: string | null
        }
        Update: {
          badge_level?: number | null
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean
          is_upi_public?: boolean
          last_upload_date?: string | null
          name?: string
          total_uploads?: number | null
          total_votes?: number | null
          updated_at?: string | null
          upi_link?: string | null
          upload_streak?: number | null
          username?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string | null
          id: string
          upload_id: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          upload_id: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          upload_id?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "votes_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_unlock_upi: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      check_and_award_badges: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      get_community_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          resources_count: number
          students_count: number
          universities_count: number
          groups_count: number
        }[]
      }
      get_course_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          course_name: string
          resource_count: number
          popular_subjects: string[]
        }[]
      }
      get_referral_leaderboard: {
        Args: { limit_count: number }
        Returns: {
          user_id: string
          user_name: string
          username: string
          referral_count: number
          total_uploads: number
          total_votes: number
        }[]
      }
      get_top_creators: {
        Args: { content_type: string; limit_count: number }
        Returns: {
          user_id: string
          user_name: string
          username: string
          total_uploads: number
          total_votes: number
          badge_count: number
        }[]
      }
      get_user_joined_groups: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          name: string
          description: string
          university: string
          telegram_link: string
          whatsapp_link: string
          is_official: boolean
          created_at: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      promote_user_to_admin: {
        Args: { target_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      badge_type:
        | "contributor"
        | "veteran"
        | "expert"
        | "legend"
        | "champion"
        | "upvote_hunter"
        | "consistent_creator"
        | "lecture_master"
        | "referral_king"
        | "rising_star"
      notification_type: "new_vote" | "content_flagged" | "new_badge"
      upload_difficulty: "Easy" | "Medium" | "Hard"
      upload_type: "note" | "lecture" | "placement"
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
      app_role: ["admin", "user"],
      badge_type: [
        "contributor",
        "veteran",
        "expert",
        "legend",
        "champion",
        "upvote_hunter",
        "consistent_creator",
        "lecture_master",
        "referral_king",
        "rising_star",
      ],
      notification_type: ["new_vote", "content_flagged", "new_badge"],
      upload_difficulty: ["Easy", "Medium", "Hard"],
      upload_type: ["note", "lecture", "placement"],
    },
  },
} as const
