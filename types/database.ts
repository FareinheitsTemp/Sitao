/**
 * types/database.ts
 * TypeScript типи для Supabase Database
 * Відповідають schema.sql
 */

export type UserRole    = "player" | "vip" | "premium" | "admin" | "owner";
export type UserStatus  = "active" | "banned" | "muted" | "pending";
export type PostStatus  = "draft" | "published" | "archived";
export type PostCategory = "news" | "update" | "event" | "maintenance";
export type DonateTier  = "vip" | "premium";
export type DonateStatus = "pending" | "paid" | "failed" | "refunded";
export type ReportStatus = "open" | "reviewing" | "resolved" | "rejected";
export type BanType     = "temporary" | "permanent";

// ─────────────────────────────────────────────────────────────
// Таблиці
// ─────────────────────────────────────────────────────────────

export interface Profile {
  id:              string;
  nickname:        string;
  display_name:    string | null;
  avatar_url:      string | null;
  role:            UserRole;
  status:          UserStatus;
  minecraft_uuid:  string | null;
  minecraft_name:  string | null;
  play_time_hours: number;
  total_deaths:    number;
  total_kills:     number;
  balance:         number;
  last_seen_at:    string | null;
  created_at:      string;
  updated_at:      string;
}

export interface LoginSession {
  id:              string;
  user_id:         string;
  ip_hash:         string;
  user_agent_hash: string;
  country_code:    string | null;
  is_suspicious:   boolean;
  created_at:      string;
  expires_at:      string;
}

export interface Post {
  id:          string;
  author_id:   string;
  title:       string;
  slug:        string;
  content:     string;
  excerpt:     string | null;
  cover_url:   string | null;
  category:    PostCategory;
  status:      PostStatus;
  views:       number;
  pinned:      boolean;
  published_at: string | null;
  created_at:  string;
  updated_at:  string;
}

export interface Comment {
  id:         string;
  post_id:    string;
  author_id:  string;
  parent_id:  string | null;
  content:    string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id:          string;
  user_id:     string;
  tier:        DonateTier;
  amount_uah:  number;
  status:      DonateStatus;
  payment_id:  string | null;
  expires_at:  string | null;
  created_at:  string;
  updated_at:  string;
}

export interface Ban {
  id:         string;
  user_id:    string;
  issued_by:  string | null;
  reason:     string;
  type:       BanType;
  expires_at: string | null;
  is_active:  boolean;
  created_at: string;
}

export interface Report {
  id:              string;
  reporter_id:     string;
  target_id:       string;
  reason:          string;
  evidence_urls:   string[];
  status:          ReportStatus;
  resolved_by:     string | null;
  resolution_note: string | null;
  created_at:      string;
  updated_at:      string;
}

export interface Notification {
  id:         string;
  user_id:    string;
  type:       string;
  title:      string;
  body:       string | null;
  is_read:    boolean;
  related_id: string | null;
  created_at: string;
}

export interface AuditLog {
  id:           number;
  actor_id:     string | null;
  action:       string;
  target_table: string | null;
  target_id:    string | null;
  old_data:     Record<string, unknown> | null;
  new_data:     Record<string, unknown> | null;
  ip_hash:      string | null;
  created_at:   string;
}

// ─────────────────────────────────────────────────────────────
// Views
// ─────────────────────────────────────────────────────────────

export interface PublicProfile {
  id:              string;
  nickname:        string;
  display_name:    string | null;
  avatar_url:      string | null;
  role:            UserRole;
  play_time_hours: number;
  total_kills:     number;
  last_seen_at:    string | null;
  created_at:      string;
}

export interface PublishedPost {
  id:             string;
  title:          string;
  slug:           string;
  excerpt:        string | null;
  cover_url:      string | null;
  category:       PostCategory;
  views:          number;
  pinned:         boolean;
  published_at:   string | null;
  author_nickname: string;
  author_avatar:  string | null;
}

// ─────────────────────────────────────────────────────────────
// Supabase Database type (для createClient<Database>)
// ─────────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row:    Profile;
        Insert: Omit<Profile, "created_at" | "updated_at"> & Partial<Pick<Profile, "created_at" | "updated_at">>;
        Update: Partial<Omit<Profile, "id">>;
      };
      login_sessions: {
        Row:    LoginSession;
        Insert: Omit<LoginSession, "id" | "created_at">;
        Update: Partial<Omit<LoginSession, "id">>;
      };
      posts: {
        Row:    Post;
        Insert: Omit<Post, "id" | "created_at" | "updated_at" | "views"> & Partial<Pick<Post, "id" | "created_at" | "updated_at" | "views">>;
        Update: Partial<Omit<Post, "id">>;
      };
      comments: {
        Row:    Comment;
        Insert: Omit<Comment, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Comment, "id" | "post_id" | "author_id">>;
      };
      donations: {
        Row:    Donation;
        Insert: Omit<Donation, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Donation, "id">>;
      };
      bans: {
        Row:    Ban;
        Insert: Omit<Ban, "id" | "created_at">;
        Update: Partial<Omit<Ban, "id">>;
      };
      reports: {
        Row:    Report;
        Insert: Omit<Report, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Report, "id" | "reporter_id" | "target_id">>;
      };
      notifications: {
        Row:    Notification;
        Insert: Omit<Notification, "id" | "created_at">;
        Update: Partial<Pick<Notification, "is_read">>;
      };
      audit_log: {
        Row:    AuditLog;
        Insert: Omit<AuditLog, "id" | "created_at">;
        Update: never; // Незмінний
      };
    };
    Views: {
      v_public_profiles: { Row: PublicProfile };
      v_published_posts: { Row: PublishedPost };
      v_staff:           { Row: PublicProfile };
    };
    Functions: {
      check_rate_limit: {
        Args: { p_identifier: string; p_action: string; p_max_count?: number; p_window_sec?: number };
        Returns: boolean;
      };
      get_public_profile: {
        Args: { p_nickname: string };
        Returns: PublicProfile[];
      };
    };
    Enums: {
      user_role:     UserRole;
      user_status:   UserStatus;
      post_status:   PostStatus;
      post_category: PostCategory;
      donate_tier:   DonateTier;
      donate_status: DonateStatus;
      report_status: ReportStatus;
      ban_type:      BanType;
    };
  };
}
