import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Database features will be disabled.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Types for database tables
export interface SessionRow {
  id: string;
  mode: 'free' | 'paid';
  answers: Array<{ questionId: string; choice: 'A' | 'B' }>;
  mbti_type: string;
  dimension_scores: Record<string, { left: number; right: number; ratio: number; percentage: number; winner: string; answered: number }>;
  referrer_id: string | null;
  share_code: string;
  unlocked_modules: string[];
  referral_count: number;
  created_at: string;
}

export interface OrderRow {
  id: string;
  session_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'refunded';
  payment_method: string | null;
  transaction_id: string | null;
  created_at: string;
  paid_at: string | null;
}

export interface ReportRow {
  id: string;
  order_id: string;
  session_id: string;
  report_content: Record<string, unknown>;
  pdf_url: string | null;
  created_at: string;
}
