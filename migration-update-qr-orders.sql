-- Add columns for design and shipment details
ALTER TABLE qr_orders 
ADD COLUMN IF NOT EXISTS design_info JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS shipment_info JSONB DEFAULT '{}'::jsonb;
