-- Create banners table for managing page banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page VARCHAR(50) NOT NULL, -- 'home', 'men', 'women'
  title VARCHAR(255),
  subtitle TEXT,
  desktop_image_url TEXT,
  mobile_image_url TEXT,
  link_url TEXT,
  button_text VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_banners_page_active ON banners(page, is_active);
CREATE INDEX IF NOT EXISTS idx_banners_display_order ON banners(display_order);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_banners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_banners_updated_at();

-- Insert default banners for each page
INSERT INTO banners (page, title, subtitle, desktop_image_url, mobile_image_url, link_url, button_text, display_order) VALUES
('home', 'Welcome to Stitch POP', 'Discover the latest fashion trends', '/placeholder.svg?height=400&width=1200', '/placeholder.svg?height=300&width=800', '/stitch-drop', 'Shop Now', 1),
('men', 'Men''s Collection', 'Stylish clothing for the modern man', '/placeholder.svg?height=400&width=1200', '/placeholder.svg?height=300&width=800', '/men', 'Explore Men''s', 1),
('women', 'Women''s Collection', 'Elegant styles for every occasion', '/placeholder.svg?height=400&width=1200', '/placeholder.svg?height=300&width=800', '/women', 'Explore Women''s', 1);

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active banners" ON banners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage banners" ON banners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    )
  );
