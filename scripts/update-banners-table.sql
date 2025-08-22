-- Update banners table to support desktop/mobile images and page types
ALTER TABLE banners 
ADD COLUMN IF NOT EXISTS page_type VARCHAR(20) DEFAULT 'home' CHECK (page_type IN ('home', 'men', 'women')),
ADD COLUMN IF NOT EXISTS desktop_image_url TEXT,
ADD COLUMN IF NOT EXISTS mobile_image_url TEXT;

-- Migrate existing image_url to desktop_image_url
UPDATE banners 
SET desktop_image_url = image_url 
WHERE desktop_image_url IS NULL AND image_url IS NOT NULL;

-- Make desktop_image_url required
ALTER TABLE banners 
ALTER COLUMN desktop_image_url SET NOT NULL;

-- Drop old image_url column if it exists
ALTER TABLE banners DROP COLUMN IF EXISTS image_url;

-- Update existing banners to have proper page types
UPDATE banners SET page_type = 'home' WHERE page_type IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_banners_page_type_active ON banners(page_type, is_active, display_order);
