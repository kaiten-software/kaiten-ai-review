
-- Create QR Orders table
CREATE TABLE IF NOT EXISTS qr_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id TEXT NOT NULL,
  business_name TEXT NOT NULL,
  plate_number TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  design_info JSONB, -- Stores selected design: {name, colorCode, details}
  shipment_info JSONB, -- Stores shipment tracking: {courier, trackingNumber, estimatedDelivery, status, timeline, currentLocation}
  status TEXT DEFAULT 'Payment Verified', -- 'Payment Verified', 'In Transit', 'Delivered'
  price NUMERIC DEFAULT 250,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policy to allow public insert (simulating payment verification)
ALTER TABLE qr_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON qr_orders FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON qr_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON qr_orders FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON qr_orders FOR DELETE USING (true);
