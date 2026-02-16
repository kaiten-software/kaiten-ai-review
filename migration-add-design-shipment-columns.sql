-- Migration to add design_info and shipment_info columns to existing qr_orders table
-- Run this in Supabase SQL Editor if the table already exists

-- Add design_info column to store selected design details
ALTER TABLE qr_orders 
ADD COLUMN IF NOT EXISTS design_info JSONB;

-- Add shipment_info column to store shipment tracking information
ALTER TABLE qr_orders 
ADD COLUMN IF NOT EXISTS shipment_info JSONB;

-- Add comments for documentation
COMMENT ON COLUMN qr_orders.design_info IS 'Stores selected design: {name, colorCode, details}';
COMMENT ON COLUMN qr_orders.shipment_info IS 'Stores shipment tracking: {courier, trackingNumber, estimatedDelivery, status, timeline, currentLocation}';
