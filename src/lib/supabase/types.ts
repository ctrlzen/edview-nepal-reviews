export type ReviewRow = {
  id: string;
  created_at: string;
  college_name: string;
  student_name: string;
  program: string;
  graduation_year: string;
  review_title: string;
  review_text: string;
  academics: number;
  teachers: number;
  facilities: number;
  student_life: number;
  career_support: number;
  value_for_money: number;
};

export type CollegePremiumRow = {
  id: string;
  college_slug: string;
  premium_active: boolean;
  features: string[];
  created_at: string;
  updated_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  created_at: string;
};

export type ReportedReviewRow = {
  id: string;
  review_id: string;
  reported_by: string;
  reason: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      reviews: {
        Row: ReviewRow;
        Insert: Omit<ReviewRow, "id" | "created_at">;
        Update: Partial<Omit<ReviewRow, "id" | "created_at">>;
        Relationships: [];
      };
      college_premium: {
        Row: CollegePremiumRow;
        Insert: Omit<CollegePremiumRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<CollegePremiumRow, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      notifications: {
        Row: NotificationRow;
        Insert: Omit<NotificationRow, "id" | "created_at">;
        Update: Partial<Omit<NotificationRow, "id" | "created_at">>;
        Relationships: [];
      };
      reported_reviews: {
        Row: ReportedReviewRow;
        Insert: Omit<ReportedReviewRow, "id" | "created_at" | "resolved_at">;
        Update: Partial<Omit<ReportedReviewRow, "id" | "created_at" | "resolved_at">>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          student_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          student_verified?: boolean;
        };
        Update: Partial<{
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          student_verified: boolean;
        }>;
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          role: string;
        };
        Update: Partial<{
          user_id: string;
          role: string;
        }>;
        Relationships: [];
      };
      college_admin_assignments: {
        Row: {
          id: string;
          user_id: string;
          college_slug: string;
          verified: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          college_slug: string;
          verified?: boolean;
        };
        Update: Partial<{
          user_id: string;
          college_slug: string;
          verified: boolean;
        }>;
        Relationships: [];
      };
      saved_colleges: {
        Row: {
          id: string;
          user_id: string;
          college_slug: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          college_slug: string;
        };
        Update: Partial<{
          user_id: string;
          college_slug: string;
        }>;
        Relationships: [];
      };
    };
  };
};