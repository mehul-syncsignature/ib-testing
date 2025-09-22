export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      AssetCategory: {
        Row: {
          createdAt: string;
          id: string;
          name: string;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          id: string;
          name: string;
          updatedAt?: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          name?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
      AssetTemplate: {
        Row: {
          assetCategoryId: string;
          createdAt: string;
          id: string;
          templates: number[] | null;
          updatedAt: string;
        };
        Insert: {
          assetCategoryId: string;
          createdAt?: string;
          id: string;
          templates?: number[] | null;
          updatedAt?: string;
        };
        Update: {
          assetCategoryId?: string;
          createdAt?: string;
          id?: string;
          templates?: number[] | null;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assettemplate_assetcategoryid_fkey";
            columns: ["assetCategoryId"];
            isOneToOne: false;
            referencedRelation: "AssetCategory";
            referencedColumns: ["id"];
          }
        ];
      };
      GeneratedContent: {
        Row: {
          createdAt: string;
          generatedText: string;
          id: string;
          keywords: string[] | null;
          model: string;
          promptType: string;
          updatedAt: string;
          userId: string | null;
        };
        Insert: {
          createdAt?: string;
          generatedText: string;
          id: string;
          keywords?: string[] | null;
          model: string;
          promptType: string;
          updatedAt?: string;
          userId?: string | null;
        };
        Update: {
          createdAt?: string;
          generatedText?: string;
          id?: string;
          keywords?: string[] | null;
          model?: string;
          promptType?: string;
          updatedAt?: string;
          userId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "generatedcontent_userid_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          }
        ];
      };
      Plan: {
        Row: {
          createdAt: string;
          description: string | null;
          id: string;
          name: string;
          planType: string;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          description?: string | null;
          id: string;
          name: string;
          planType: string;
          updatedAt?: string;
        };
        Update: {
          createdAt?: string;
          description?: string | null;
          id?: string;
          name?: string;
          planType?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
      PlanLimit: {
        Row: {
          allowedTemplates: Json;
          createdAt: string;
          id: string;
          planId: string;
          updatedAt: string;
        };
        Insert: {
          allowedTemplates: Json;
          createdAt?: string;
          id: string;
          planId: string;
          updatedAt?: string;
        };
        Update: {
          allowedTemplates?: Json;
          createdAt?: string;
          id?: string;
          planId?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "planlimit_planid_fkey";
            columns: ["planId"];
            isOneToOne: false;
            referencedRelation: "Plan";
            referencedColumns: ["id"];
          }
        ];
      };
      User: {
        Row: {
          createdAt: string;
          email: string;
          firstName: string | null;
          id: string;
          lastName: string | null;
          planId: string | null;
          profileUrl: string | null;
          supabaseUserId: string;
          updatedAt: string;
        };
        Insert: {
          createdAt?: string;
          email: string;
          firstName?: string | null;
          id: string;
          lastName?: string | null;
          planId?: string | null;
          profileUrl?: string | null;
          supabaseUserId: string;
          updatedAt?: string;
        };
        Update: {
          createdAt?: string;
          email?: string;
          firstName?: string | null;
          id?: string;
          lastName?: string | null;
          planId?: string | null;
          profileUrl?: string | null;
          supabaseUserId?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_planid_fkey";
            columns: ["planId"];
            isOneToOne: false;
            referencedRelation: "Plan";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
