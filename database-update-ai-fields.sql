-- ==================== ADD AI-GENERATED FIELDS TO CLIENTS TABLE ====================
-- This update adds fields for AI-generated content to support dynamic business pages

-- Add new columns for AI-generated content
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS staff JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS qualities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS feelings TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS search_keywords TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;

-- Add comment to explain the structure
COMMENT ON COLUMN clients.services IS 'Array of service objects with name, price, duration, description, and image';
COMMENT ON COLUMN clients.staff IS 'Array of staff objects with name, role, experience, specialty, and image';
COMMENT ON COLUMN clients.qualities IS 'Array of quality descriptors for review generation';
COMMENT ON COLUMN clients.feelings IS 'Array of feeling descriptors for review generation';
COMMENT ON COLUMN clients.search_keywords IS 'Array of SEO keywords for better discoverability';
COMMENT ON COLUMN clients.gallery IS 'Array of gallery image objects with url, title, and category';

-- ==================== UPDATE EXISTING RAJ SALON WITH SAMPLE DATA ====================
-- Update the existing Raj Salon entry with AI-generated content

UPDATE clients
SET 
  business_type = 'salon',
  services = '[
    {"name": "Haircut & Styling", "price": "₹500", "duration": "45 min", "description": "Professional haircut with styling", "image": "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop"},
    {"name": "Hair Coloring", "price": "₹2000", "duration": "2 hours", "description": "Full color or highlights", "image": "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&h=400&fit=crop"},
    {"name": "Hair Treatment", "price": "₹1500", "duration": "1 hour", "description": "Deep conditioning & repair", "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop"}
  ]'::jsonb,
  staff = '[
    {"name": "Raj Kumar", "role": "Master Stylist", "experience": "15 years", "specialty": "Creative Cuts & Styling", "image": "https://i.pravatar.cc/300?img=12"},
    {"name": "Priya Sharma", "role": "Senior Stylist", "experience": "10 years", "specialty": "Color Specialist", "image": "https://i.pravatar.cc/300?img=45"},
    {"name": "Amit Patel", "role": "Barber", "experience": "8 years", "specialty": "Classic & Modern Cuts", "image": "https://i.pravatar.cc/300?img=33"}
  ]'::jsonb,
  qualities = ARRAY['Professional', 'Skilled', 'Friendly', 'Clean', 'Punctual', 'Creative', 'Attentive', 'Experienced'],
  feelings = ARRAY['Happy', 'Satisfied', 'Confident', 'Relaxed', 'Impressed', 'Delighted', 'Refreshed', 'Pampered'],
  search_keywords = ARRAY['Best salon in Jaipur', 'Professional hair styling', 'Top-rated salon near me', 'Expert hair colorist', 'Premium salon services', 'Bridal hair specialist'],
  gallery = '[
    {"url": "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop", "title": "Modern Salon Interior", "category": "interior"},
    {"url": "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop", "title": "Professional Haircut", "category": "service"},
    {"url": "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=800&h=600&fit=crop", "title": "Hair Styling", "category": "service"},
    {"url": "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&h=600&fit=crop", "title": "Barber Shop", "category": "interior"},
    {"url": "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=800&h=600&fit=crop", "title": "Hair Treatment", "category": "service"},
    {"url": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&h=600&fit=crop", "title": "Salon Equipment", "category": "interior"}
  ]'::jsonb
WHERE business_id = 'raj-salon';

-- ==================== COMPLETED ====================
-- Database schema updated successfully!
-- All new clients will now support AI-generated content
