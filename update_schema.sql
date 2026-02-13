-- Add newly used columns to the 'clients' table if they are missing

-- 1. Social Media Links
alter table public.clients 
add column if not exists social_media_links jsonb default '[]'::jsonb;

-- 2. Staff / Team Members
alter table public.clients 
add column if not exists staff jsonb default '[]'::jsonb;

-- 3. Services
alter table public.clients 
add column if not exists services jsonb default '[]'::jsonb;

-- 4. Google Business URL
alter table public.clients 
add column if not exists google_business_url text;

-- 5. Qualities (Tags)
alter table public.clients 
add column if not exists qualities text[] default '{}';

-- 6. Feelings (Tags)
alter table public.clients 
add column if not exists feelings text[] default '{}';

-- 7. Gallery
alter table public.clients 
add column if not exists gallery jsonb default '[]'::jsonb;


-- Instructions:
-- Copy this entire script and run it in the Supabase SQL Editor.
-- This will ensure all the new fields in the "Add Client" form can be saved correctly.
