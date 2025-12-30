export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      skill_categories: {
        Row: {
          id: string;
          icon_name: string;
          title_en: string;
          title_da: string;
          skills: string[];
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          icon_name: string;
          title_en: string;
          title_da: string;
          skills: string[];
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          icon_name?: string;
          title_en?: string;
          title_da?: string;
          skills?: string[];
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      work_experiences: {
        Row: {
          id: string;
          title_en: string;
          title_da: string;
          position_en: string;
          position_da: string;
          points_en: string[];
          points_da: string[];
          year_label: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title_en: string;
          title_da: string;
          position_en: string;
          position_da: string;
          points_en: string[];
          points_da: string[];
          year_label: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title_en?: string;
          title_da?: string;
          position_en?: string;
          position_da?: string;
          points_en?: string[];
          points_da?: string[];
          year_label?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          title_en: string;
          title_da: string;
          institution_en: string;
          institution_da: string;
          competencies_en: string[];
          competencies_da: string[];
          year_label: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title_en: string;
          title_da: string;
          institution_en: string;
          institution_da: string;
          competencies_en: string[];
          competencies_da: string[];
          year_label: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title_en?: string;
          title_da?: string;
          institution_en?: string;
          institution_da?: string;
          competencies_en?: string[];
          competencies_da?: string[];
          year_label?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title_en: string;
          title_da: string;
          description_en: string;
          description_da: string;
          technologies: string[];
          points_en: string[] | null;
          points_da: string[] | null;
          metrics: Json | null;
          label_en: string;
          label_da: string;
          year_label: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title_en: string;
          title_da: string;
          description_en: string;
          description_da: string;
          technologies: string[];
          points_en?: string[] | null;
          points_da?: string[] | null;
          metrics?: Json | null;
          label_en: string;
          label_da: string;
          year_label?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title_en?: string;
          title_da?: string;
          description_en?: string;
          description_da?: string;
          technologies?: string[];
          points_en?: string[] | null;
          points_da?: string[] | null;
          metrics?: Json | null;
          label_en?: string;
          label_da?: string;
          year_label?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      languages: {
        Row: {
          id: string;
          lang_en: string;
          lang_da: string;
          level_en: string;
          level_da: string;
          flag: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lang_en: string;
          lang_da: string;
          level_en: string;
          level_da: string;
          flag: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lang_en?: string;
          lang_da?: string;
          level_en?: string;
          level_da?: string;
          flag?: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
