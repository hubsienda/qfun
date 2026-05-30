import type { Json } from '@/lib/qoobix/types';

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          slug: string;
          sector: string;
          description: string | null;
          website: string | null;
          products_services: string | null;
          target_countries: string[];
          target_customer_types: string[];
          target_channels: string[];
          known_competitors: string | null;
          known_representatives: string | null;
          preferred_language: string;
          available_report_types: string[];
          file_retention_days: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          slug: string;
          sector?: string;
          description?: string | null;
          website?: string | null;
          products_services?: string | null;
          target_countries?: string[];
          target_customer_types?: string[];
          target_channels?: string[];
          known_competitors?: string | null;
          known_representatives?: string | null;
          preferred_language?: string;
          available_report_types?: string[];
          file_retention_days?: number;
          is_active?: boolean;
        };
        Update: {
          updated_at?: string;
          name?: string;
          slug?: string;
          sector?: string;
          description?: string | null;
          website?: string | null;
          products_services?: string | null;
          target_countries?: string[];
          target_customer_types?: string[];
          target_channels?: string[];
          known_competitors?: string | null;
          known_representatives?: string | null;
          preferred_language?: string;
          available_report_types?: string[];
          file_retention_days?: number;
          is_active?: boolean;
        };
      };
      access_codes: {
        Row: {
          id: string;
          created_at: string;
          client_id: string;
          code: string | null;
          code_hash: string | null;
          recovery_phrase_hash: string | null;
          label: string | null;
          expires_at: string | null;
          is_active: boolean;
          last_used_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          client_id: string;
          code?: string | null;
          code_hash?: string | null;
          recovery_phrase_hash?: string | null;
          label?: string | null;
          expires_at?: string | null;
          is_active?: boolean;
          last_used_at?: string | null;
        };
        Update: {
          code?: string | null;
          code_hash?: string | null;
          recovery_phrase_hash?: string | null;
          label?: string | null;
          expires_at?: string | null;
          is_active?: boolean;
          last_used_at?: string | null;
        };
      };
      jobs: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          client_id: string;
          status: string;
          request_metadata: Json;
          result_token: string;
          error_message: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          client_id: string;
          status?: string;
          request_metadata: Json;
          result_token: string;
          error_message?: string | null;
        };
        Update: {
          updated_at?: string;
          status?: string;
          request_metadata?: Json;
          result_token?: string;
          error_message?: string | null;
        };
      };
      reports: {
        Row: {
          id: string;
          created_at: string;
          job_id: string;
          file_type: string;
          file_name: string;
          file_url: string;
          storage_path: string | null;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          job_id: string;
          file_type: string;
          file_name: string;
          file_url: string;
          storage_path?: string | null;
          expires_at?: string | null;
        };
        Update: {
          file_type?: string;
          file_name?: string;
          file_url?: string;
          storage_path?: string | null;
          expires_at?: string | null;
        };
      };
      job_logs: {
        Row: {
          id: string;
          created_at: string;
          job_id: string | null;
          level: string;
          message: string;
          details: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          job_id?: string | null;
          level: string;
          message: string;
          details?: Json | null;
        };
        Update: {
          level?: string;
          message?: string;
          details?: Json | null;
        };
      };
    };
  };
};
