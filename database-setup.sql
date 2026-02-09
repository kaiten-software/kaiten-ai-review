-- ==================== CLIENTS TABLE ====================
-- This table stores all business clients/customers

CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  hero_image TEXT,
  logo TEXT DEFAULT '🏢',
  tagline TEXT,
  description TEXT,
  subscription_plan TEXT DEFAULT 'monthly' CHECK (subscription_plan IN ('monthly', 'annual', '3-year')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'trial', 'expired')),
  subscription_start_date TIMESTAMPTZ DEFAULT NOW(),
  subscription_end_date TIMESTAMPTZ,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  qr_code_url TEXT,
  google_business_url TEXT,
  social_media_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on business_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_business_id ON clients(business_id);
CREATE INDEX IF NOT EXISTS idx_clients_subscription_status ON clients(subscription_status);

-- ==================== REVIEWS TABLE ====================
-- This table stores all customer reviews

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id TEXT NOT NULL,
  business_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  qualities TEXT[] DEFAULT '{}',
  feelings TEXT[] DEFAULT '{}',
  service_used TEXT,
  staff_member TEXT,
  posted_to_google BOOLEAN DEFAULT FALSE,
  google_review_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (business_id) REFERENCES clients(business_id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_posted_to_google ON reviews(posted_to_google);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- ==================== ROW LEVEL SECURITY (RLS) ====================
-- Enable RLS for security

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to clients
CREATE POLICY "Allow public read access to clients"
  ON clients FOR SELECT
  USING (true);

-- Allow public insert/update to clients (for admin operations)
CREATE POLICY "Allow public insert to clients"
  ON clients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to clients"
  ON clients FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete to clients"
  ON clients FOR DELETE
  USING (true);

-- Allow public read access to reviews
CREATE POLICY "Allow public read access to reviews"
  ON reviews FOR SELECT
  USING (true);

-- Allow public insert to reviews (for customer submissions)
CREATE POLICY "Allow public insert to reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Allow public update to reviews (for marking as posted)
CREATE POLICY "Allow public update to reviews"
  ON reviews FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete to reviews"
  ON reviews FOR DELETE
  USING (true);

-- ==================== FUNCTIONS ====================
-- Function to update updated_at timestamp

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==================== SAMPLE DATA (OPTIONAL) ====================
-- Insert sample client for testing

INSERT INTO clients (
  business_id,
  business_name,
  email,
  phone,
  address,
  logo,
  tagline,
  description,
  subscription_plan,
  subscription_status,
  google_business_url
) VALUES (
  'raj-salon',
  'Raj''s Salon',
  'contact@rajsalon.com',
  '+91 98765 43210',
  '123 Main Street, Jaipur, Rajasthan',
  '💇',
  'Where Style Meets Perfection',
  'Premium salon offering haircuts, styling, and beauty services',
  'annual',
  'active',
  'https://g.page/raj-salon'
) ON CONFLICT (business_id) DO NOTHING;

-- ==================== VIEWS FOR ANALYTICS ====================
-- View for client statistics

CREATE OR REPLACE VIEW client_statistics AS
SELECT 
  c.business_id,
  c.business_name,
  c.total_reviews,
  c.average_rating,
  c.subscription_status,
  COUNT(r.id) AS actual_review_count,
  AVG(r.rating) AS calculated_avg_rating,
  COUNT(CASE WHEN r.posted_to_google THEN 1 END) AS posted_reviews,
  COUNT(CASE WHEN r.rating >= 4 THEN 1 END) AS positive_reviews,
  COUNT(CASE WHEN r.rating <= 2 THEN 1 END) AS negative_reviews
FROM clients c
LEFT JOIN reviews r ON c.business_id = r.business_id
GROUP BY c.business_id, c.business_name, c.total_reviews, c.average_rating, c.subscription_status;

-- View for recent reviews
CREATE OR REPLACE VIEW recent_reviews AS
SELECT 
  r.id,
  r.business_id,
  r.business_name,
  r.customer_name,
  r.rating,
  r.review_text,
  r.posted_to_google,
  r.created_at
FROM reviews r
ORDER BY r.created_at DESC
LIMIT 100;

-- ==================== COMPLETED ====================
-- Tables created successfully!
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Verify tables are created
-- 3. Test the integration
