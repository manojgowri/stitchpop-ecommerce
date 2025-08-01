-- Drop existing tables if they exist
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
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create themes table (replaces collections)
CREATE TABLE themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  gender TEXT NOT NULL CHECK (gender IN ('men', 'women', 'kids', 'couple', 'unisex')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, gender)
);

-- Create products table with theme and category relationships
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  colors TEXT[] NOT NULL DEFAULT '{}',
  fit TEXT NOT NULL DEFAULT 'Regular',
  stock INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  theme_id UUID REFERENCES themes(id) ON DELETE SET NULL,
  gender TEXT NOT NULL CHECK (gender IN ('men', 'women', 'kids', 'couple', 'unisex')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_on_sale BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0,
  discount_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'packed', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'unpaid', 'refunded')),
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

-- Create offline_orders table
CREATE TABLE offline_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coupons table
CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('flat', 'percentage')),
  value DECIMAL(10,2) NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart table for persistent cart
CREATE TABLE cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, size, color)
);

-- Create low_stock_alerts table
CREATE TABLE low_stock_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  threshold INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_settings table
CREATE TABLE admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default themes
INSERT INTO themes (name, description, image_url) VALUES
('Summer Drop 2025', 'Fresh summer collection with vibrant colors and lightweight fabrics', '/placeholder.svg?height=300&width=400&text=Summer+Drop'),
('Anime Fest', 'Anime-inspired designs and graphics for otaku culture enthusiasts', '/placeholder.svg?height=300&width=400&text=Anime+Fest'),
('Graphic Fest 2025', 'Bold graphic designs and artistic prints', '/placeholder.svg?height=300&width=400&text=Graphic+Fest'),
('Retro Vibes', 'Vintage-inspired designs with a modern twist', '/placeholder.svg?height=300&width=400&text=Retro+Vibes'),
('Minimalist', 'Clean, simple designs for the modern wardrobe', '/placeholder.svg?height=300&width=400&text=Minimalist'),
('Street Style', 'Urban fashion with edgy designs', '/placeholder.svg?height=300&width=400&text=Street+Style');

-- Insert default categories for each gender
INSERT INTO categories (name, description, gender) VALUES
-- Men's categories
('T-Shirts', 'Comfortable cotton t-shirts in various styles', 'men'),
('Shirts', 'Formal and casual shirts for all occasions', 'men'),
('Jeans', 'Denim jeans in different fits and washes', 'men'),
('Jackets', 'Stylish jackets and outerwear', 'men'),
('Hoodies', 'Comfortable hoodies and sweatshirts', 'men'),
('Shorts', 'Casual shorts for summer and sports', 'men'),

-- Women's categories
('T-Shirts', 'Stylish t-shirts and basic tops', 'women'),
('Tops', 'Fashionable tops and blouses', 'women'),
('Dresses', 'Beautiful dresses for all occasions', 'women'),
('Jeans', 'Trendy jeans in various cuts', 'women'),
('Jackets', 'Chic jackets and blazers', 'women'),
('Crop Tops', 'Trendy crop tops and short tops', 'women'),

-- Kids categories
('T-Shirts', 'Fun and colorful t-shirts for kids', 'kids'),
('Dresses', 'Cute dresses for little girls', 'kids'),
('Shorts', 'Comfortable shorts for active kids', 'kids'),
('Hoodies', 'Cozy hoodies for children', 'kids'),

-- Couple categories
('Matching T-Shirts', 'Coordinated t-shirts for couples', 'couple'),
('Hoodies', 'Matching hoodies for couples', 'couple');

-- Insert sample products with themes
INSERT INTO products (name, description, price, original_price, images, sizes, colors, category_id, theme_id, gender, is_featured, is_on_sale, stock) VALUES
-- Men's products
(
  'Anime Hero Graphic Tee',
  'Premium cotton t-shirt featuring popular anime character designs',
  599,
  899,
  ARRAY['/placeholder.svg?height=400&width=300&text=Anime+Hero+Tee'],
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Black', 'White', 'Navy'],
  (SELECT id FROM categories WHERE name = 'T-Shirts' AND gender = 'men'),
  (SELECT id FROM themes WHERE name = 'Anime Fest'),
  'men',
  true,
  true,
  50
),
(
  'Summer Vibes Casual Shirt',
  'Lightweight cotton shirt perfect for summer outings',
  799,
  1299,
  ARRAY['/placeholder.svg?height=400&width=300&text=Summer+Shirt'],
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Light Blue', 'White', 'Mint Green'],
  (SELECT id FROM categories WHERE name = 'Shirts' AND gender = 'men'),
  (SELECT id FROM themes WHERE name = 'Summer Drop 2025'),
  'men',
  true,
  true,
  30
),

-- Women's products
(
  'Minimalist Crop Top',
  'Clean and simple crop top for the modern woman',
  449,
  699,
  ARRAY['/placeholder.svg?height=400&width=300&text=Minimalist+Crop'],
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Black', 'White', 'Beige'],
  (SELECT id FROM categories WHERE name = 'Crop Tops' AND gender = 'women'),
  (SELECT id FROM themes WHERE name = 'Minimalist'),
  'women',
  true,
  true,
  40
),
(
  'Retro Floral Dress',
  'Vintage-inspired dress with beautiful floral patterns',
  1299,
  1899,
  ARRAY['/placeholder.svg?height=400&width=300&text=Retro+Dress'],
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Floral Pink', 'Floral Blue', 'Floral Yellow'],
  (SELECT id FROM categories WHERE name = 'Dresses' AND gender = 'women'),
  (SELECT id FROM themes WHERE name = 'Retro Vibes'),
  'women',
  true,
  true,
  25
);

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
('low_stock_threshold', '5', 'Minimum stock level before triggering low stock alert'),
('email_notifications', 'true', 'Enable email notifications for low stock'),
('razorpay_key_id', '', 'Razorpay Key ID for payment processing'),
('google_recaptcha_site_key', '', 'Google reCAPTCHA site key');

-- Create indexes for better performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_theme_id ON products(theme_id);
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_on_sale ON products(is_on_sale);
CREATE INDEX idx_categories_gender ON categories(gender);
CREATE INDEX idx_themes_is_active ON themes(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_cart_user_id ON cart(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
