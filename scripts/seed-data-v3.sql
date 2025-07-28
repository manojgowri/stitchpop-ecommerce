-- Insert sample users
INSERT INTO users (id, email, name, is_admin) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@stitchpop.com', 'Admin User', TRUE),
('550e8400-e29b-41d4-a716-446655440001', 'john@example.com', 'John Doe', FALSE),
('550e8400-e29b-41d4-a716-446655440002', 'jane@example.com', 'Jane Smith', FALSE);

-- Insert categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('T-Shirts', 't-shirts', 'Comfortable and stylish t-shirts for everyday wear', '/placeholder.svg?height=200&width=300&text=T-Shirts'),
('Shirts', 'shirts', 'Formal and casual shirts for all occasions', '/placeholder.svg?height=200&width=300&text=Shirts'),
('Jeans', 'jeans', 'Premium denim jeans in various fits and styles', '/placeholder.svg?height=200&width=300&text=Jeans'),
('Dresses', 'dresses', 'Elegant dresses for women', '/placeholder.svg?height=200&width=300&text=Dresses'),
('Tops', 'tops', 'Trendy tops and blouses for women', '/placeholder.svg?height=200&width=300&text=Tops'),
('Jackets', 'jackets', 'Stylish jackets and outerwear', '/placeholder.svg?height=200&width=300&text=Jackets');

-- Insert sample products
INSERT INTO products (name, description, price, original_price, images, sizes, colors, stock, category, gender, rating, is_featured) VALUES
-- Men's T-Shirts
('Classic Cotton T-Shirt', 'Premium quality cotton t-shirt with comfortable fit. Perfect for everyday wear with a timeless design that never goes out of style.', 399.00, 899.00, ARRAY['/placeholder.svg?height=400&width=300&text=Classic+Cotton+Front', '/placeholder.svg?height=400&width=300&text=Classic+Cotton+Side', '/placeholder.svg?height=400&width=300&text=Classic+Cotton+Back'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy', 'Gray'], 50, 't-shirts', 'men', 4.5, TRUE),

('Graphic Print Oversized Tee', 'Trendy oversized t-shirt with unique graphic design. Made from soft cotton blend for ultimate comfort and street-style appeal.', 499.00, 999.00, ARRAY['/placeholder.svg?height=400&width=300&text=Graphic+Print+Front', '/placeholder.svg?height=400&width=300&text=Graphic+Print+Side', '/placeholder.svg?height=400&width=300&text=Graphic+Print+Back'], ARRAY['M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Olive'], 30, 't-shirts', 'men', 4.3, TRUE),

('Vintage Wash T-Shirt', 'Soft vintage-washed cotton tee with relaxed fit. Pre-washed for that perfect lived-in feel and faded aesthetic.', 599.00, 1199.00, ARRAY['/placeholder.svg?height=400&width=300&text=Vintage+Wash+Front', '/placeholder.svg?height=400&width=300&text=Vintage+Wash+Side', '/placeholder.svg?height=400&width=300&text=Vintage+Wash+Back'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Faded Blue', 'Charcoal', 'Rust'], 25, 't-shirts', 'men', 4.7, FALSE),

-- Men's Shirts
('Casual Denim Shirt', 'Classic denim shirt perfect for layering or wearing solo. Features button-down collar and chest pockets for a timeless look.', 799.00, 1299.00, ARRAY['/placeholder.svg?height=400&width=300&text=Denim+Shirt+Front', '/placeholder.svg?height=400&width=300&text=Denim+Shirt+Side'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Light Blue', 'Dark Blue', 'Black'], 40, 'shirts', 'men', 4.4, TRUE),

('Formal White Shirt', 'Crisp white formal shirt made from premium cotton. Perfect for office wear and formal occasions with a tailored fit.', 899.00, 1599.00, ARRAY['/placeholder.svg?height=400&width=300&text=White+Shirt+Front', '/placeholder.svg?height=400&width=300&text=White+Shirt+Side'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['White'], 35, 'shirts', 'men', 4.6, FALSE),

-- Men's Jeans
('Slim Fit Dark Jeans', 'Modern slim fit jeans in dark wash. Made from premium denim with stretch for comfort and mobility.', 1299.00, 2199.00, ARRAY['/placeholder.svg?height=400&width=300&text=Slim+Jeans+Front', '/placeholder.svg?height=400&width=300&text=Slim+Jeans+Side'], ARRAY['28', '30', '32', '34', '36'], ARRAY['Dark Blue', 'Black'], 45, 'jeans', 'men', 4.5, TRUE),

('Relaxed Fit Blue Jeans', 'Comfortable relaxed fit jeans in classic blue wash. Perfect for casual wear with a timeless straight-leg silhouette.', 1199.00, 1999.00, ARRAY['/placeholder.svg?height=400&width=300&text=Relaxed+Jeans+Front', '/placeholder.svg?height=400&width=300&text=Relaxed+Jeans+Side'], ARRAY['28', '30', '32', '34', '36', '38'], ARRAY['Light Blue', 'Medium Blue'], 38, 'jeans', 'men', 4.2, FALSE),

-- Women's Dresses
('Floral Summer Dress', 'Beautiful floral print dress perfect for summer occasions. Features a flattering A-line silhouette and comfortable midi length.', 899.00, 1599.00, ARRAY['/placeholder.svg?height=400&width=300&text=Floral+Dress+Front', '/placeholder.svg?height=400&width=300&text=Floral+Dress+Side', '/placeholder.svg?height=400&width=300&text=Floral+Dress+Back'], ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Pink Floral', 'Blue Floral', 'White Floral'], 28, 'dresses', 'women', 4.6, TRUE),

('Little Black Dress', 'Elegant little black dress suitable for any occasion. Features a classic silhouette that flatters all body types.', 1299.00, 2299.00, ARRAY['/placeholder.svg?height=400&width=300&text=Black+Dress+Front', '/placeholder.svg?height=400&width=300&text=Black+Dress+Side'], ARRAY['XS', 'S', 'M', 'L'], ARRAY['Black'], 22, 'dresses', 'women', 4.8, TRUE),

-- Women's Tops
('Casual Crop Top', 'Trendy crop top perfect for casual outings. Made from soft cotton blend with a comfortable relaxed fit.', 399.00, 699.00, ARRAY['/placeholder.svg?height=400&width=300&text=Crop+Top+Front', '/placeholder.svg?height=400&width=300&text=Crop+Top+Side'], ARRAY['XS', 'S', 'M', 'L'], ARRAY['White', 'Black', 'Pink', 'Mint'], 42, 'tops', 'women', 4.3, FALSE),

('Silk Blouse', 'Elegant silk blouse perfect for office wear or special occasions. Features a classic button-up design with a sophisticated drape.', 1599.00, 2799.00, ARRAY['/placeholder.svg?height=400&width=300&text=Silk+Blouse+Front', '/placeholder.svg?height=400&width=300&text=Silk+Blouse+Side'], ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Ivory', 'Navy', 'Burgundy'], 18, 'tops', 'women', 4.7, TRUE),

-- Women's Jeans
('High-Waisted Skinny Jeans', 'Flattering high-waisted skinny jeans that hug your curves perfectly. Made from stretch denim for comfort and style.', 1199.00, 1899.00, ARRAY['/placeholder.svg?height=400&width=300&text=Skinny+Jeans+Front', '/placeholder.svg?height=400&width=300&text=Skinny+Jeans+Side'], ARRAY['24', '26', '28', '30', '32'], ARRAY['Dark Blue', 'Black', 'Light Blue'], 33, 'jeans', 'women', 4.4, FALSE),

-- Jackets
('Denim Jacket', 'Classic denim jacket that pairs well with any outfit. Features a vintage-inspired design with modern fit and comfort.', 1599.00, 2599.00, ARRAY['/placeholder.svg?height=400&width=300&text=Denim+Jacket+Front', '/placeholder.svg?height=400&width=300&text=Denim+Jacket+Back'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Light Blue', 'Dark Blue'], 26, 'jackets', 'unisex', 4.5, TRUE),

('Leather Jacket', 'Premium leather jacket with a timeless design. Perfect for adding an edge to any outfit with superior quality and craftsmanship.', 3999.00, 6999.00, ARRAY['/placeholder.svg?height=400&width=300&text=Leather+Jacket+Front', '/placeholder.svg?height=400&width=300&text=Leather+Jacket+Back'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Brown'], 15, 'jackets', 'unisex', 4.9, TRUE);

-- Insert collections
INSERT INTO collections (name, description, image_url) VALUES
('Summer Essentials', 'Light and breezy pieces perfect for the warm season. Stay cool and stylish with our curated summer collection.', '/placeholder.svg?height=300&width=600&text=Summer+Collection'),
('Urban Streetwear', 'Bold and edgy pieces for the modern urbanite. Express your street style with confidence and attitude.', '/placeholder.svg?height=300&width=600&text=Streetwear+Collection'),
('Classic Elegance', 'Timeless pieces that never go out of style. Sophisticated and refined clothing for the discerning individual.', '/placeholder.svg?height=300&width=600&text=Classic+Collection'),
('Weekend Casual', 'Comfortable and relaxed clothing perfect for your downtime. Look effortlessly stylish on your days off.', '/placeholder.svg?height=300&width=600&text=Casual+Collection');

-- Insert sample cart items
INSERT INTO cart (user_id, product_id, quantity, size, color) VALUES
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM products WHERE name = 'Classic Cotton T-Shirt' LIMIT 1), 2, 'M', 'Black'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM products WHERE name = 'Slim Fit Dark Jeans' LIMIT 1), 1, '32', 'Dark Blue'),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM products WHERE name = 'Floral Summer Dress' LIMIT 1), 1, 'S', 'Pink Floral');

-- Insert sample orders
INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method, payment_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1698.00, 'delivered', '123 Main St, City, State 12345', 'credit_card', 'completed'),
('550e8400-e29b-41d4-a716-446655440002', 899.00, 'shipped', '456 Oak Ave, City, State 67890', 'paypal', 'completed');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price, size, color) VALUES
((SELECT id FROM orders WHERE user_id = '550e8400-e29b-41d4-a716-446655440001' LIMIT 1), (SELECT id FROM products WHERE name = 'Classic Cotton T-Shirt' LIMIT 1), 2, 399.00, 'M', 'Black'),
((SELECT id FROM orders WHERE user_id = '550e8400-e29b-41d4-a716-446655440001' LIMIT 1), (SELECT id FROM products WHERE name = 'Slim Fit Dark Jeans' LIMIT 1), 1, 1299.00, '32', 'Dark Blue'),
((SELECT id FROM orders WHERE user_id = '550e8400-e29b-41d4-a716-446655440002' LIMIT 1), (SELECT id FROM products WHERE name = 'Floral Summer Dress' LIMIT 1), 1, 899.00, 'S', 'Pink Floral');

-- Insert sample reviews
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM products WHERE name = 'Classic Cotton T-Shirt' LIMIT 1), 5, 'Excellent quality and very comfortable. Perfect fit and the material is soft and durable.'),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM products WHERE name = 'Floral Summer Dress' LIMIT 1), 4, 'Beautiful dress, perfect for summer occasions. The floral print is lovely and the fit is flattering.'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM products WHERE name = 'Slim Fit Dark Jeans' LIMIT 1), 4, 'Great fit and quality denim. Comfortable to wear all day and the dark wash looks premium.');
