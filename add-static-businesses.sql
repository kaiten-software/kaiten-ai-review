-- Add static businesses to the clients table
-- Run this in Supabase SQL Editor
-- NOTE: Replace the google_business_url values with actual Google review page URLs

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
    subscription_start_date,
    subscription_end_date,
    total_reviews,
    average_rating,
    google_business_url
) VALUES
-- Raj's Salon
('raj-salon', 'Raj''s Salon', 'contact@rajssalon.com', '+91-9876543210', '123 MG Road, Bangalore, Karnataka 560001', '💇', 'Where Style Meets Excellence', 'Premium hair salon offering expert cuts, styling, and treatments in a luxurious setting.', 'monthly', 'active', NOW(), NOW() + INTERVAL '1 month', 87, 4.8, NULL),

-- Spa Paradise
('spa-paradise', 'Spa Paradise', 'info@spaparadise.com', '+91-9876543211', '45 Koramangala, Bangalore, Karnataka 560034', '🧖', 'Your Oasis of Tranquility', 'Luxury spa offering massages, facials, and wellness treatments in a serene environment.', 'monthly', 'active', NOW(), NOW() + INTERVAL '1 month', 124, 4.9, NULL),

-- Pizza Corner
('pizza-corner', 'Pizza Corner', 'hello@pizzacorner.com', '+91-9876543212', '78 Indiranagar, Bangalore, Karnataka 560038', '🍕', 'Authentic Italian Flavors', 'Wood-fired pizzas made with fresh ingredients and traditional Italian recipes.', 'monthly', 'active', NOW(), NOW() + INTERVAL '1 month', 45, 4.5, NULL),

-- Fitness Hub
('fitness-hub', 'Fitness Hub', 'info@fitnesshub.com', '+91-9876543213', '90 HSR Layout, Bangalore, Karnataka 560102', '💪', 'Transform Your Body & Mind', 'State-of-the-art gym with personal trainers, group classes, and modern equipment.', 'monthly', 'active', NOW(), NOW() + INTERVAL '1 month', 63, 4.7, NULL),

-- Beauty Lounge
('beauty-lounge', 'Beauty Lounge', 'contact@beautylounge.com', '+91-9876543214', '12 Whitefield, Bangalore, Karnataka 560066', '💄', 'Enhance Your Natural Beauty', 'Premium beauty salon offering makeup, skincare, and beauty treatments.', 'monthly', 'active', NOW(), NOW() + INTERVAL '1 month', 168, 4.9, NULL),

-- Tech Solutions Pro
('tech-solutions', 'Tech Solutions Pro', 'info@techsolutions.com', '+91-9876543215', '34 Electronic City, Bangalore, Karnataka 560100', '💻', 'Your Technology Partner', 'Complete IT solutions including software development, web design, and tech support.', 'monthly', 'active', NOW(), NOW() + INTERVAL '1 month', 92, 4.8, NULL),

-- The Coffee House
('coffee-house', 'The Coffee House', 'hello@thecoffeehouse.com', '+91-9876543216', '56 Brigade Road, Bangalore, Karnataka 560025', '☕', 'Brewing Happiness Daily', 'Artisan coffee shop serving premium coffee, fresh pastries, and light meals.', 'monthly', 'active', NOW(), NOW() + INTERVAL '1 month', 156, 4.6, NULL)

ON CONFLICT (business_id) 
DO UPDATE SET 
    total_reviews = EXCLUDED.total_reviews,
    average_rating = EXCLUDED.average_rating,
    google_business_url = EXCLUDED.google_business_url;
