-- Insert admin user
INSERT INTO users (name, email, is_admin) VALUES
('Admin User', 'admin@stitchpop.com', TRUE);

-- Insert sample collections
INSERT INTO collections (name, description, category, is_active) VALUES
('Urban Streetwear', 'Bold designs for the modern man', 'men', TRUE),
('Classic Essentials', 'Timeless pieces for everyday wear', 'men', TRUE),
('Athletic Performance', 'Gear up for your active lifestyle', 'men', TRUE),
('Premium Comfort', 'Luxury meets comfort in every piece', 'men', TRUE),
('Summer Essentials', 'Light and breezy pieces for the season', 'women', TRUE),
('Elegant Evenings', 'Sophisticated pieces for special occasions', 'women', TRUE),
('Casual Comfort', 'Everyday wear that doesn''t compromise on style', 'women', TRUE),
('Active Lifestyle', 'Performance meets style for your active days', 'women', TRUE);

-- Insert sample products for men
INSERT INTO products (name, description, price, original_price, size, color, fit, stock, category, gender, collection_id, is_featured, discount_percentage) VALUES
('Classic Cotton T-Shirt', 'Premium quality cotton t-shirt with comfortable fit', 599, 999, ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy', 'Gray'], 'Regular', 25, 't-shirts', 'men', (SELECT id FROM collections WHERE name = 'Classic Essentials' LIMIT 1), TRUE, 40),
('Graphic Print Oversized Tee', 'Trendy oversized t-shirt with unique graphic design', 799, 1299, ARRAY['M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Olive'], 'Oversized', 15, 't-shirts', 'men', (SELECT id FROM collections WHERE name = 'Urban Streetwear' LIMIT 1), TRUE, 38),
('Vintage Wash T-Shirt', 'Soft vintage-washed cotton tee with relaxed fit', 699, 1199, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Faded Blue', 'Charcoal', 'Rust'], 'Relaxed', 8, 't-shirts', 'men', (SELECT id FROM collections WHERE name = 'Classic Essentials' LIMIT 1), FALSE, 42),
('Premium Polo T-Shirt', 'Elegant polo t-shirt perfect for casual and semi-formal occasions', 1299, 1899, ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Navy', 'White', 'Maroon', 'Forest Green'], 'Regular', 32, 'polo', 'men', (SELECT id FROM collections WHERE name = 'Premium Comfort' LIMIT 1), TRUE, 32),
('Streetwear Graphic Tee', 'Bold streetwear design with premium print quality', 899, 1499, ARRAY['M', 'L', 'XL'], ARRAY['Black', 'White'], 'Oversized', 3, 't-shirts', 'men', (SELECT id FROM collections WHERE name = 'Urban Streetwear' LIMIT 1), TRUE, 40),
('Basic Crew Neck Tee', 'Essential crew neck t-shirt for everyday wear', 499, 799, ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Gray', 'Navy', 'Olive'], 'Regular', 45, 't-shirts', 'men', (SELECT id FROM collections WHERE name = 'Classic Essentials' LIMIT 1), FALSE, 38),
('Athletic Performance Tee', 'Moisture-wicking fabric for active lifestyle', 899, 1299, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Navy', 'Gray'], 'Athletic', 20, 't-shirts', 'men', (SELECT id FROM collections WHERE name = 'Athletic Performance' LIMIT 1), TRUE, 31),
('Baggy Cargo Pants', 'Comfortable baggy fit with multiple pockets', 1599, 2299, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Khaki', 'Black', 'Olive'], 'Baggy', 12, 'pants', 'men', (SELECT id FROM collections WHERE name = 'Urban Streetwear' LIMIT 1), TRUE, 30),
('Slim Fit Chinos', 'Modern slim fit chinos for smart casual look', 1299, 1899, ARRAY['28', '30', '32', '34', '36'], ARRAY['Beige', 'Navy', 'Black'], 'Slim', 18, 'pants', 'men', (SELECT id FROM collections WHERE name = 'Classic Essentials' LIMIT 1), FALSE, 32),
('Comfort Joggers', 'Ultra-soft joggers for maximum comfort', 999, 1499, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Gray', 'Black', 'Navy'], 'Regular', 22, 'pants', 'men', (SELECT id FROM collections WHERE name = 'Premium Comfort' LIMIT 1), TRUE, 33);

-- Insert sample products for women
INSERT INTO products (name, description, price, original_price, size, color, fit, stock, category, gender, collection_id, is_featured, discount_percentage) VALUES
('Floral Print Crop Top', 'Stylish crop top with beautiful floral design', 699, 1199, ARRAY['XS', 'S', 'M', 'L'], ARRAY['Pink', 'White', 'Lavender'], 'Regular', 18, 'tops', 'women', (SELECT id FROM collections WHERE name = 'Summer Essentials' LIMIT 1), TRUE, 42),
('Elegant Silk Blouse', 'Premium silk blouse for sophisticated occasions', 1899, 2799, ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Cream', 'Black', 'Navy'], 'Regular', 8, 'tops', 'women', (SELECT id FROM collections WHERE name = 'Elegant Evenings' LIMIT 1), TRUE, 32),
('Casual Cotton Tee', 'Comfortable cotton t-shirt for everyday wear', 599, 999, ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['White', 'Black', 'Pink', 'Blue'], 'Regular', 35, 'tops', 'women', (SELECT id FROM collections WHERE name = 'Casual Comfort' LIMIT 1), FALSE, 40),
('Sports Bra Top', 'High-support sports bra for active lifestyle', 799, 1299, ARRAY['XS', 'S', 'M', 'L'], ARRAY['Black', 'Gray', 'Pink'], 'Athletic', 25, 'tops', 'women', (SELECT id FROM collections WHERE name = 'Active Lifestyle' LIMIT 1), TRUE, 38),
('High-Waisted Jeans', 'Trendy high-waisted jeans with perfect fit', 1599, 2299, ARRAY['24', '26', '28', '30', '32'], ARRAY['Blue', 'Black', 'Light Blue'], 'High-Waisted', 14, 'bottoms', 'women', (SELECT id FROM collections WHERE name = 'Casual Comfort' LIMIT 1), TRUE, 30),
('Flowy Summer Pants', 'Light and airy pants perfect for summer', 1299, 1899, ARRAY['XS', 'S', 'M', 'L'], ARRAY['White', 'Beige', 'Light Pink'], 'Flowy', 20, 'bottoms', 'women', (SELECT id FROM collections WHERE name = 'Summer Essentials' LIMIT 1), TRUE, 32),
('Yoga Leggings', 'Stretchy and comfortable leggings for yoga and workouts', 899, 1399, ARRAY['XS', 'S', 'M', 'L'], ARRAY['Black', 'Gray', 'Navy'], 'Athletic', 30, 'bottoms', 'women', (SELECT id FROM collections WHERE name = 'Active Lifestyle' LIMIT 1), TRUE, 36),
('Elegant Evening Dress', 'Sophisticated dress for special occasions', 2499, 3999, ARRAY['XS', 'S', 'M', 'L'], ARRAY['Black', 'Navy', 'Burgundy'], 'A-Line', 6, 'dresses', 'women', (SELECT id FROM collections WHERE name = 'Elegant Evenings' LIMIT 1), TRUE, 38),
('Casual Midi Skirt', 'Versatile midi skirt for everyday styling', 1199, 1799, ARRAY['XS', 'S', 'M', 'L'], ARRAY['Black', 'Beige', 'Floral'], 'Regular', 16, 'bottoms', 'women', (SELECT id FROM collections WHERE name = 'Casual Comfort' LIMIT 1), FALSE, 33),
('Summer Shorts', 'Comfortable shorts for warm weather', 799, 1299, ARRAY['XS', 'S', 'M', 'L'], ARRAY['White', 'Khaki', 'Denim'], 'Regular', 28, 'bottoms', 'women', (SELECT id FROM collections WHERE name = 'Summer Essentials' LIMIT 1), TRUE, 38);

-- Insert sample orders
INSERT INTO orders (user_id, status, payment_status, total, shipping_address) VALUES
((SELECT id FROM users WHERE email = 'admin@stitchpop.com'), 'delivered', 'paid', 1299, '123 Main St, Mumbai, Maharashtra 400001'),
((SELECT id FROM users WHERE email = 'admin@stitchpop.com'), 'shipped', 'paid', 899, '456 Park Ave, Delhi, Delhi 110001'),
((SELECT id FROM users WHERE email = 'admin@stitchpop.com'), 'pending', 'paid', 1599, '789 Beach Rd, Goa, Goa 403001');

-- Insert sample coupons
INSERT INTO coupons (code, discount_type, value, expiry_date, usage_limit) VALUES
('WELCOME10', 'percentage', 10, '2024-12-31 23:59:59', 100),
('SAVE500', 'flat', 500, '2024-12-31 23:59:59', 50),
('NEWUSER20', 'percentage', 20, '2024-12-31 23:59:59', 200),
('SUMMER25', 'percentage', 25, '2024-08-31 23:59:59', 75);

-- Insert sample reviews
INSERT INTO reviews (user_id, product_id, rating, comment, is_verified) VALUES
((SELECT id FROM users WHERE email = 'admin@stitchpop.com'), (SELECT id FROM products WHERE name = 'Classic Cotton T-Shirt' LIMIT 1), 5, 'Excellent quality! The fabric is soft and the fit is perfect.', TRUE),
((SELECT id FROM users WHERE email = 'admin@stitchpop.com'), (SELECT id FROM products WHERE name = 'Graphic Print Oversized Tee' LIMIT 1), 4, 'Great design and comfortable fit. Highly recommend!', TRUE),
((SELECT id FROM users WHERE email = 'admin@stitchpop.com'), (SELECT id FROM products WHERE name = 'Premium Polo T-Shirt' LIMIT 1), 5, 'Perfect for both casual and semi-formal occasions.', TRUE);

-- Update admin settings with sample values
UPDATE admin_settings SET setting_value = '5' WHERE setting_key = 'low_stock_threshold';
UPDATE admin_settings SET setting_value = 'true' WHERE setting_key = 'email_notifications';
