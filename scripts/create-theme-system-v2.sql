-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS offline_orders CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS low_stock_alerts CASCADE;
DROP TABLE IF EXISTS admin_settings CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS themes CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create themes table
CREATE TABLE themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    gender VARCHAR(50) NOT NULL CHECK (gender IN ('men', 'women', 'kids', 'couple', 'unisex')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, gender)
);

-- Create products table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    images TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    stock INTEGER DEFAULT 0,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    theme_id UUID REFERENCES themes(id) ON DELETE SET NULL,
    gender VARCHAR(50) NOT NULL CHECK (gender IN ('men', 'women', 'kids', 'couple', 'unisex')),
    rating DECIMAL(3,2) DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_on_sale BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'packed', 'shipped', 'delivered', 'cancelled')),
    payment_status VARCHAR(50) DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'unpaid', 'refunded')),
    total DECIMAL(10,2) NOT NULL,
    shipping_address TEXT,
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart table
CREATE TABLE cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id, size, color)
);

-- Create reviews table
CREATE TABLE reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    user_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert themes (with ON CONFLICT to avoid duplicates)
INSERT INTO themes (name, description, is_active) VALUES
('Summer Drop', 'Fresh summer collection with vibrant colors and lightweight fabrics', true),
('Anime Fest', 'Anime-inspired designs and graphics for otaku culture enthusiasts', true),
('Graphic Fest 2025', 'Bold graphic designs and artistic prints for the modern generation', true),
('Retro Vibes', 'Vintage-inspired clothing with a modern twist', true),
('Street Style', 'Urban streetwear collection for the fashion-forward', true),
('Minimalist', 'Clean, simple designs for the sophisticated wardrobe', true),
('Festival Ready', 'Perfect outfits for music festivals and outdoor events', true),
('Gaming Culture', 'Gaming-inspired apparel for the digital generation', true)
ON CONFLICT (name) DO NOTHING;

-- Insert categories for Men
INSERT INTO categories (name, description, gender, is_active) VALUES
('T-Shirts', 'Comfortable and stylish t-shirts for everyday wear', 'men', true),
('Shirts', 'Formal and casual shirts for various occasions', 'men', true),
('Jeans', 'Denim jeans in various fits and washes', 'men', true),
('Jackets', 'Outerwear including blazers, hoodies, and coats', 'men', true),
('Shorts', 'Comfortable shorts for casual and athletic wear', 'men', true),
('Hoodies', 'Cozy hoodies and sweatshirts', 'men', true)
ON CONFLICT (name, gender) DO NOTHING;

-- Insert categories for Women
INSERT INTO categories (name, description, gender, is_active) VALUES
('Tops', 'Stylish tops and blouses for women', 'women', true),
('Dresses', 'Beautiful dresses for all occasions', 'women', true),
('Jeans', 'Fashionable denim for women', 'women', true),
('Skirts', 'Trendy skirts in various styles', 'women', true),
('Crop Tops', 'Modern crop tops for casual wear', 'women', true),
('Jackets', 'Stylish outerwear for women', 'women', true)
ON CONFLICT (name, gender) DO NOTHING;

-- Insert categories for Kids
INSERT INTO categories (name, description, gender, is_active) VALUES
('T-Shirts', 'Fun and comfortable t-shirts for kids', 'kids', true),
('Dresses', 'Cute dresses for young girls', 'kids', true),
('Shorts', 'Comfortable shorts for active kids', 'kids', true),
('Hoodies', 'Cozy hoodies for children', 'kids', true)
ON CONFLICT (name, gender) DO NOTHING;

-- Insert categories for Couples
INSERT INTO categories (name, description, gender, is_active) VALUES
('Matching T-Shirts', 'Coordinated t-shirts for couples', 'couple', true),
('Hoodies', 'Matching hoodies for couples', 'couple', true)
ON CONFLICT (name, gender) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_theme_id ON products(theme_id);
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_on_sale ON products(is_on_sale);
CREATE INDEX IF NOT EXISTS idx_categories_gender ON categories(gender);
CREATE INDEX IF NOT EXISTS idx_themes_is_active ON themes(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
DO $$
DECLARE
    tshirt_men_id UUID;
    shirt_men_id UUID;
    jeans_men_id UUID;
    jacket_men_id UUID;
    tops_women_id UUID;
    dress_women_id UUID;
    jeans_women_id UUID;
    jacket_women_id UUID;
    summer_theme_id UUID;
    anime_theme_id UUID;
    graphic_theme_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO tshirt_men_id FROM categories WHERE name = 'T-Shirts' AND gender = 'men';
    SELECT id INTO shirt_men_id FROM categories WHERE name = 'Shirts' AND gender = 'men';
    SELECT id INTO jeans_men_id FROM categories WHERE name = 'Jeans' AND gender = 'men';
    SELECT id INTO jacket_men_id FROM categories WHERE name = 'Jackets' AND gender = 'men';
    SELECT id INTO tops_women_id FROM categories WHERE name = 'Tops' AND gender = 'women';
    SELECT id INTO dress_women_id FROM categories WHERE name = 'Dresses' AND gender = 'women';
    SELECT id INTO jeans_women_id FROM categories WHERE name = 'Jeans' AND gender = 'women';
    SELECT id INTO jacket_women_id FROM categories WHERE name = 'Jackets' AND gender = 'women';
    
    -- Get theme IDs
    SELECT id INTO summer_theme_id FROM themes WHERE name = 'Summer Drop';
    SELECT id INTO anime_theme_id FROM themes WHERE name = 'Anime Fest';
    SELECT id INTO graphic_theme_id FROM themes WHERE name = 'Graphic Fest 2025';

    -- Insert sample products for Men
    INSERT INTO products (name, description, price, original_price, images, sizes, colors, stock, category_id, theme_id, gender, rating, is_featured, is_on_sale) VALUES
    ('Oversized Graphic Tee', 'Comfortable oversized t-shirt with bold graphic design', 599, 899, ARRAY['/placeholder.svg?height=400&width=400&text=Oversized+Graphic+Tee'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Gray'], 50, tshirt_men_id, graphic_theme_id, 'men', 4.5, true, true),
    ('Summer Vibes Tee', 'Lightweight cotton t-shirt perfect for summer', 449, NULL, ARRAY['/placeholder.svg?height=400&width=400&text=Summer+Vibes+Tee'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue', 'Yellow', 'Pink'], 75, tshirt_men_id, summer_theme_id, 'men', 4.2, false, false),
    ('Anime Hero Shirt', 'Premium shirt featuring popular anime characters', 799, 1199, ARRAY['/placeholder.svg?height=400&width=400&text=Anime+Hero+Shirt'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Navy'], 30, shirt_men_id, anime_theme_id, 'men', 4.7, true, true),
    ('Classic Denim Jeans', 'Timeless denim jeans with perfect fit', 1299, NULL, ARRAY['/placeholder.svg?height=400&width=400&text=Classic+Denim+Jeans'], ARRAY['28', '30', '32', '34', '36'], ARRAY['Blue', 'Black'], 40, jeans_men_id, NULL, 'men', 4.3, false, false),
    ('Summer Bomber Jacket', 'Lightweight bomber jacket for summer evenings', 1799, 2299, ARRAY['/placeholder.svg?height=400&width=400&text=Summer+Bomber+Jacket'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Olive', 'Black', 'Navy'], 25, jacket_men_id, summer_theme_id, 'men', 4.6, true, true);

    -- Insert sample products for Women
    INSERT INTO products (name, description, price, original_price, images, sizes, colors, stock, category_id, theme_id, gender, rating, is_featured, is_on_sale) VALUES
    ('Floral Summer Top', 'Beautiful floral print top perfect for summer', 699, NULL, ARRAY['/placeholder.svg?height=400&width=400&text=Floral+Summer+Top'], ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Pink', 'Blue', 'White'], 60, tops_women_id, summer_theme_id, 'women', 4.4, true, false),
    ('Anime Princess Dress', 'Cute dress inspired by anime princess aesthetics', 1199, 1699, ARRAY['/placeholder.svg?height=400&width=400&text=Anime+Princess+Dress'], ARRAY['XS', 'S', 'M', 'L'], ARRAY['Pink', 'Purple', 'White'], 35, dress_women_id, anime_theme_id, 'women', 4.8, true, true),
    ('Graphic Art Top', 'Artistic graphic print top for the creative soul', 599, 899, ARRAY['/placeholder.svg?height=400&width=400&text=Graphic+Art+Top'], ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'White', 'Gray'], 45, tops_women_id, graphic_theme_id, 'women', 4.1, false, true),
    ('High Waist Jeans', 'Trendy high waist jeans for women', 1399, NULL, ARRAY['/placeholder.svg?height=400&width=400&text=High+Waist+Jeans'], ARRAY['24', '26', '28', '30', '32'], ARRAY['Blue', 'Black', 'White'], 50, jeans_women_id, NULL, 'women', 4.5, true, false),
    ('Denim Jacket', 'Classic denim jacket for layering', 1599, 1999, ARRAY['/placeholder.svg?height=400&width=400&text=Denim+Jacket'], ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Blue', 'Black'], 30, jacket_women_id, NULL, 'women', 4.3, false, true);
END $$;
