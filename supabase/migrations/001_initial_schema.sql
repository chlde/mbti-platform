-- ============================================
-- MBTI Platform - Initial Database Schema
-- ============================================

-- 测评会话
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode TEXT NOT NULL CHECK (mode IN ('free', 'paid')),
  answers JSONB NOT NULL DEFAULT '[]',
  mbti_type TEXT NOT NULL,
  dimension_scores JSONB NOT NULL DEFAULT '{}',
  referrer_id UUID REFERENCES sessions(id),
  share_code TEXT UNIQUE,
  unlocked_modules TEXT[] DEFAULT '{}',
  referral_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 支付订单（Phase 2）
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- 付费报告（Phase 2）
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  session_id UUID REFERENCES sessions(id),
  report_content JSONB NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_share_code ON sessions(share_code);
CREATE INDEX IF NOT EXISTS idx_sessions_referrer_id ON sessions(referrer_id);
CREATE INDEX IF NOT EXISTS idx_sessions_mbti_type ON sessions(mbti_type);
CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_reports_session_id ON reports(session_id);

-- ============================================
-- RLS (Row Level Security) Policies
-- ============================================

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 允许匿名插入新会话
CREATE POLICY "Allow anonymous insert" ON sessions
  FOR INSERT WITH CHECK (true);

-- 允许通过 id 或 share_code 查询会话
CREATE POLICY "Allow select by id or share_code" ON sessions
  FOR SELECT USING (true);

-- 允许更新 referral_count 和 unlocked_modules（裂变追踪）
CREATE POLICY "Allow update referrals" ON sessions
  FOR UPDATE USING (true) WITH CHECK (true);

-- Orders & Reports: 允许通过 session_id 查询
CREATE POLICY "Allow select orders by session" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Allow select reports by session" ON reports
  FOR SELECT USING (true);

CREATE POLICY "Allow insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert reports" ON reports
  FOR INSERT WITH CHECK (true);

-- ============================================
-- Helper: generate unique share_code
-- ============================================
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT := '';
  exists_flag BOOLEAN;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    
    SELECT EXISTS(SELECT 1 FROM sessions WHERE share_code = code) INTO exists_flag;
    EXIT WHEN NOT exists_flag;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger: auto-generate share_code on insert
CREATE OR REPLACE FUNCTION set_share_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_code IS NULL THEN
    NEW.share_code := generate_share_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_share_code
  BEFORE INSERT ON sessions
  FOR EACH ROW EXECUTE FUNCTION set_share_code();

-- Trigger: auto-increment referrer's referral_count
CREATE OR REPLACE FUNCTION increment_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referrer_id IS NOT NULL THEN
    UPDATE sessions
    SET referral_count = referral_count + 1
    WHERE id = NEW.referrer_id;
    
    -- Auto-unlock modules based on referral_count
    UPDATE sessions SET
      unlocked_modules = CASE
        WHEN referral_count >= 5 THEN ARRAY['love', 'career', 'hidden']
        WHEN referral_count >= 3 THEN ARRAY['love', 'career']
        WHEN referral_count >= 1 THEN ARRAY['love']
        ELSE '{}'
      END
    WHERE id = NEW.referrer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_referral
  AFTER INSERT ON sessions
  FOR EACH ROW EXECUTE FUNCTION increment_referral_count();
