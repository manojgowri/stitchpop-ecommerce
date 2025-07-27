-- Insert sample products
INSERT INTO products (name, description, price, original_price, size, color, fit, stock, category, gender) VALUES
('Men''s Graphic Print T-shirt', 'Comfortable oversized fit with unique graphic design', 399, 899, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'White', 'Gray'], 'Oversized', 50, 't-shirts', 'men'),
('Men''s Vintage Graphic Tee', 'Retro-style graphic tee with premium cotton', 499, 999, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Brown', 'Beige', 'Black'], 'Oversized', 30, 't-shirts', 'men'),
('Women''s Crop Top', 'Stylish crop top perfect for casual wear', 299, 599, ARRAY['XS', 'S', 'M', 'L'], ARRAY['Pink', 'Black', 'White'], 'Regular', 40, 'tops', 'women'),
('Men''s Baggy Pants', 'Comfortable baggy fit pants for street style', 799, 1299, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Navy', 'Khaki'], 'Baggy', 25, 'pants', 'men'),
('Women''s Track Pants', 'Athletic track pants with side stripes', 599, 999, ARRAY['XS', 'S', 'M', 'L'], ARRAY['Navy', 'Black', 'Gray'], 'Regular', 35, 'bottoms', 'women');

-- Insert sample coupons
INSERT INTO coupons (code, discount_type, value, expiry_date) VALUES
('SAVE10', 'percentage', 10, '2024-12-31 23:59:59'),
('FLAT50', 'flat', 50, '2024-12-31 23:59:59'),
('WELCOME20', 'percentage', 20, '2024-12-31 23:59:59');

-- Insert sample admin user (you'll need to update this with actual auth user ID)
-- INSERT INTO users (id, name, email, is_admin) VALUES
-- ('your-auth-user-id', 'Admin User', 'admin@stitchpop.com', TRUE);
