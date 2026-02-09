-- ==================== DATABASE SCHEMA UPDATE ====================
-- Add new columns to clients table for AI-generated content

-- Add JSONB columns for services, staff, and other arrays
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS staff JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS qualities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS feelings TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS search_keywords TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS business_type TEXT DEFAULT 'other';

-- Add comment to explain the new columns
COMMENT ON COLUMN clients.services IS 'Array of service objects with name, price, duration, description, image';
COMMENT ON COLUMN clients.staff IS 'Array of staff member objects with name, role, experience, specialty, image';
COMMENT ON COLUMN clients.qualities IS 'Array of quality descriptors for review forms';
COMMENT ON COLUMN clients.feelings IS 'Array of feeling descriptors for review forms';
COMMENT ON COLUMN clients.search_keywords IS 'Array of SEO keywords for the business';
COMMENT ON COLUMN clients.gallery IS 'Array of gallery image objects';
COMMENT ON COLUMN clients.business_type IS 'Type of business (salon, spa, restaurant, etc.)';

-- ==================== COMPLETED ====================
-- Run this SQL in your Supabase SQL Editor to update the schema
