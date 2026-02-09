-- Migration: Add social_media_links column to clients table
-- Run this in Supabase SQL Editor

-- Add social_media_links column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'clients' 
        AND column_name = 'social_media_links'
    ) THEN
        ALTER TABLE clients ADD COLUMN social_media_links JSONB DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Column social_media_links added to clients table';
    ELSE
        RAISE NOTICE 'Column social_media_links already exists';
    END IF;
END $$;

-- Update existing static businesses with sample social media links
UPDATE clients 
SET social_media_links = '[
    {"platform": "instagram", "url": "https://instagram.com/rajssalon"},
    {"platform": "facebook", "url": "https://facebook.com/rajssalon"}
]'::jsonb 
WHERE business_id = 'raj-salon';

UPDATE clients 
SET social_media_links = '[
    {"platform": "instagram", "url": "https://instagram.com/spaparadise"},
    {"platform": "tiktok", "url": "https://tiktok.com/@spaparadise"}
]'::jsonb 
WHERE business_id = 'spa-paradise';

UPDATE clients 
SET social_media_links = '[
    {"platform": "instagram", "url": "https://instagram.com/pizzacorner"},
    {"platform": "twitter", "url": "https://twitter.com/pizzacorner"}
]'::jsonb 
WHERE business_id = 'pizza-corner';

-- Add empty array default for others to avoid nulls if preferred, or leave as null
UPDATE clients SET social_media_links = '[]'::jsonb WHERE social_media_links IS NULL;
