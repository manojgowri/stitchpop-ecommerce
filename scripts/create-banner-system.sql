-- Create banners table for admin-managed homepage slider
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  redirect_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample banners
INSERT INTO banners (title, subtitle, image_url, redirect_url, display_order) VALUES
('New Collection Launch', 'Discover the latest trends in fashion', '/placeholder.svg?height=600&width=1200&text=New+Collection', '/categories', 1),
('Summer Sale', 'Up to 50% off on selected items', '/placeholder.svg?height=600&width=1200&text=Summer+Sale', '/stitch-drop', 2),
('Premium Quality', 'Crafted with the finest materials', '/placeholder.svg?height=600&width=1200&text=Premium+Quality', '/men', 3);
