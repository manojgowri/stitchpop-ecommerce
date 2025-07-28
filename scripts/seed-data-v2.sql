-- Seed data for Stitch POP ecommerce

-- Insert categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('T-Shirts', 't-shirts', 'Comfortable and stylish t-shirts for everyday wear', '/placeholder.svg?height=200&width=300&text=T-Shirts'),
('Shirts', 'shirts', 'Formal and casual shirts for all occasions', '/placeholder.svg?height=200&width=300&text=Shirts'),
('Jeans', 'jeans', 'Premium denim jeans in various fits and styles', '/placeholder.svg?height=200&width=300&text=Jeans'),
('Dresses', 'dresses', 'Elegant dresses for women', '/placeholder.svg?height=200&width=300&text=Dresses'),
('Tops', 'tops', 'Trendy tops and blouses for women', '/placeholder.svg?height=200&width=300&text=Tops'),
('Jackets', 'jackets', 'Stylish jackets and outerwear', '/placeholder.svg?height=200&width=300&text=Jackets')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, original_price, category, gender, fit, stock, images, sizes, colors, rating, is_featured) VALUES
-- Men's T-Shirts
('Classic Cotton T-Shirt', 'Comfortable oversized fit with premium cotton blend. Perfect for casual wear and everyday styling.', 399, 899, 't-shirts', 'men', 'Oversized', 50, 
 ARRAY['/placeholder.svg?height=500&width=400&text=T-shirt+Front', '/placeholder.svg?height=500&width=400&text=T-shirt+Side', '/placeholder.svg?height=500&width=400&text=T-shirt+Back'], 
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'White', 'Gray'], 4.5, TRUE),

('Graphic Print T-Shirt', 'Trendy graphic print t-shirt with modern design and comfortable fit.', 499, 999, 't-shirts', 'men', 'Regular', 30, 
 ARRAY['/placeholder.svg?height=500&width=400&text=Graphic+Front', '/placeholder.svg?height=500&width=400&text=Graphic+Side', '/placeholder.svg?height=500&width=400&text=Graphic+Back'], 
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Navy', 'Black', 'White'], 4.3, TRUE),

('Vintage Band T-Shirt', 'Retro-style band t-shirt with vintage wash and soft fabric.', 599, 1199, 't-shirts', 'men', 'Regular', 25, 
 ARRAY['/placeholder.svg?height=500&width=400&text=Band+Tee+Front', '/placeholder.svg?height=500&width=400&text=Band+Tee+Side', '/placeholder.svg?height=500&width=400&text=Band+Tee+Back'], 
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Gray', 'Navy'], 4.7, FALSE),

-- Men's Shirts
('Denim Casual Shirt', 'Classic denim shirt perfect for casual and semi-formal occasions.', 799, 1299, 'shirts', 'men', 'Regular', 40, 
 ARRAY['/placeholder.svg?height=500&width=400&text=Denim+Shirt+Front', '/placeholder.svg?height=500&width=400&text=Denim+Shirt+Side', '/placeholder.svg?height=500&width=400&text=Denim+Shirt+Back'], 
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue', 'Light Blue', 'Black'], 4.4, TRUE),

('Formal White Shirt', 'Crisp white formal shirt perfect for office and formal events.', 899, 1599, 'shirts', 'men', 'Slim', 35, 
 ARRAY['/placeholder.svg?height=500&width=400&text=Formal+Shirt+Front', '/placeholder.svg?height=500&width=400&text=Formal+Shirt+Side', '/placeholder.svg?height=500&width=400&text=Formal+Shirt+Back'], 
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['White', 'Light Blue'], 4.6, FALSE),

-- Men's Jeans
('Slim Fit Jeans', 'Modern slim fit jeans with stretch fabric for comfort and style.', 1299, 2199, 'jeans', 'men', 'Slim', 45, 
 ARRAY['/placeholder.svg?height=500&width=400&text=Slim+Jeans+Front', '/placeholder.svg?height=500&width=400&text=Slim+Jeans+Side', '/placeholder.svg?height=500&width=400&text=Slim+Jeans+Back'], 
 ARRAY['28', '30', '32', '34', '36'], ARRAY['Dark Blue', 'Light Blue', 'Black'], 4.5, TRUE),

-- Women's Dresses
('Floral Summer Dress', 'Beautiful floral print dress perfect for summer occasions and casual outings.', 599, 1199, 'dresses', 'women', 'A-Line', 30, 
 ARRAY['/placeholder.svg?height=500&width=400&text=Floral+Dress+Front', '/placeholder.svg?height=500&width=400&text=Floral+Dress+Side', '/placeholder.svg?height=500&width=400&text=Floral+Dress+Back'], 
 ARRAY['XS', 'S', 'M', 'L'], ARRAY['Pink', 'Blue', 'White'], 4.6, TRUE),

('Little Black Dress', 'Elegant black dress suitable for formal events and evening occasions.', 899, 1799, 'dresses', 'women', 'Bodycon', 20, 
 ARRAY['/placeholder.svg?height=500&width=400&text=Black+Dress+Front', '/placeholder.svg?height=500&width=400&text=Black+Dress+Side', '/placeholder.svg?height=500&width=400&text=Black+Dress+Back'], 
 ARRAY['XS', 'S', 'M', 'L'], ARRAY['Black'], 4.8, TRUE),

-- Women's Tops
('Casual Crop Top', 'Trendy crop top perfect for casual wear and layering.', 299, 599, 'tops', 'women', 'Cropped', 40, 
 ARRAY['/placeholder.svg?height=500&width=400&text=Crop+Top+Front', '/placeholder.svg?height=500&width=400&text=Crop+Top+Side', '/placeholder.svg?height=500&width=400&text=Crop+Top+Back'], 
 ARRAY['XS', 'S', 'M', 'L'], ARRAY['Pink', 'Black', 'White'], 4.4, FALSE),

('Silk Blouse', 'Elegant silk blouse perfect for office wear and formal occasions.', 799, 1399, 'tops', 'women', 'Regular', 25, 
 ARRAY['/placeholder.svg?height=500&width=400&text=Silk+Blouse+Front', '/placeholder.svg?height=500&width=400&text=Silk+Blouse+Side', '/placeholder.svg?height=500&width=400&text=Silk+Blouse+Back'], 
 ARRAY['XS', 'S', 'M', 'L'], ARRAY['White', 'Cream', 'Navy'], 4.7, TRUE),

-- Women's Jeans
('High-Waisted Jeans', 'Trendy high-waisted jeans with a flattering fit and comfortable stretch.', 999, 1799, 'jeans', 'women', 'High-Waisted', 35, 
 ARRAY['/placeholder.svg?height=500&width=400&text=High+Waist+Front', '/placeholder.svg?height=500&width=400&text=High+Waist+Side', '/placeholder.svg?height=500&width=400&text=High+Waist+Back'], 
 ARRAY['24', '26', '28', '30', '32'], ARRAY['Dark Blue', 'Light Blue', 'Black'], 4.5, TRUE),

-- Jackets
('Denim Jacket', 'Classic denim jacket perfect for layering and casual styling.', 1299, 2199, 'jackets', 'unisex', 'Regular', 20, 
 ARRAY['/placeholder.svg?height=500&width=400&text=Denim+Jacket+Front', '/placeholder.svg?height=500&width=400&text=Denim+Jacket+Side', '/placeholder.svg?height=500&width=400&text=Denim+Jacket+Back'], 
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Blue', 'Black', 'Light Blue'], 4.6, FALSE),

('Leather Jacket', 'Premium leather jacket with modern design and superior quality.', 2999, 4999, 'jackets', 'unisex', 'Regular', 15, 
 ARRAY['/placeholder.svg?height=500&width=400&text=Leather+Jacket+Front', '/placeholder.svg?height=500&width=400&text=Leather+Jacket+Side', '/placeholder.svg?height=500&width=400&text=Leather+Jacket+Back'], 
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Brown'], 4.8, TRUE)

ON CONFLICT (id) DO NOTHING;

-- Insert collections
INSERT INTO collections (name, description, image_url) VALUES
('Summer Collection 2024', 'Fresh and vibrant pieces perfect for the summer season', '/placeholder.svg?height=400&width=600&text=Summer+Collection'),
('Formal Essentials', 'Professional attire for the modern workplace', '/placeholder.svg?height=400&width=600&text=Formal+Collection'),
('Casual Comfort', 'Comfortable everyday wear for relaxed styling', '/placeholder.svg?height=400&width=600&text=Casual+Collection'),
('Premium Denim', 'High-quality denim pieces in various fits and washes', '/placeholder.svg?height=400&width=600&text=Denim+Collection')
ON CONFLICT (id) DO NOTHING;

-- Create admin user (this would typically be done through the application)
INSERT INTO users (id, email, name, is_admin) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@stitchpop.com', 'Admin User', TRUE)
ON CONFLICT (id) DO NOTHING;
