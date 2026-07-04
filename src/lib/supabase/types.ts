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

export type Database = {
  public: {
    Tables: {
      reviews: {
        Row: ReviewRow;
        Insert: Omit<ReviewRow, "id" | "created_at">;
        Update: Partial<Omit<ReviewRow, "id" | "created_at">>;
        Relationships: [];
      };
    };
  };
};