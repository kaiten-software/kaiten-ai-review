-- Migration: Add google_business_url column to clients table
-- Run this if you already have an existing database

-- Add google_business_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'clients' 
        AND column_name = 'google_business_url'
    ) THEN
        ALTER TABLE clients ADD COLUMN google_business_url TEXT;
        RAISE NOTICE 'Column google_business_url added to clients table';
    ELSE
        RAISE NOTICE 'Column google_business_url already exists';
    END IF;
END $$;

-- Update existing static businesses with their Google review URLs (optional)
-- Replace these URLs with actual Google review page URLs for each business
-- Format: https://g.page/r/YOUR_PLACE_ID/review

-- Example updates (uncomment and modify with actual URLs):
-- UPDATE clients SET google_business_url = 'https://g.page/r/PLACE_ID_1/review' WHERE business_id = 'raj-salon';
-- UPDATE clients SET google_business_url = 'https://g.page/r/PLACE_ID_2/review' WHERE business_id = 'spa-paradise';
-- UPDATE clients SET google_business_url = 'https://g.page/r/PLACE_ID_3/review' WHERE business_id = 'pizza-corner';
