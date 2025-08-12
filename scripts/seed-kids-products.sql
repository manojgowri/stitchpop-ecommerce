-- Insert sample kids products
DO $$
DECLARE
    shirts_kids_id UUID;
    hoodies_kids_id UUID;
    summer_theme_id UUID;
    graphic_theme_id UUID;
BEGIN
    -- Get kids category IDs
    SELECT id INTO shirts_kids_id FROM categories WHERE name = 'Shirts' AND gender = 'kids';
    SELECT id INTO hoodies_kids_id FROM categories WHERE name = 'Hoodies' AND gender = 'kids';
    
    -- Get theme IDs
    SELECT id INTO summer_theme_id FROM themes WHERE name = 'Summer Drop';
    SELECT id INTO graphic_theme_id FROM themes WHERE name = 'Graphic Fest 2025';

    -- Insert sample kids shirts
    INSERT INTO products (name, description, price, original_price, images, sizes, colors, stock, category_id, theme_id, gender, rating, is_featured, is_on_sale) VALUES
    ('Superhero Adventure Shirt', 'Fun superhero-themed shirt for adventurous kids', 599, 799, ARRAY['/placeholder.svg?height=400&width=400&text=Superhero+Shirt'], ARRAY['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'], ARRAY['Blue', 'Red', 'Black'], 50, shirts_kids_id, graphic_theme_id, 'kids', 4.6, true, true),
    ('Rainbow Unicorn Shirt', 'Magical unicorn design perfect for little dreamers', 549, NULL, ARRAY['/placeholder.svg?height=400&width=400&text=Unicorn+Shirt'], ARRAY['2-3Y', '4-5Y', '6-7Y', '8-9Y'], ARRAY['Pink', 'Purple', 'White'], 40, shirts_kids_id, NULL, 'kids', 4.8, true, false),
    ('Cool Dinosaur Shirt', 'Awesome dinosaur graphics for dino-loving kids', 629, 749, ARRAY['/placeholder.svg?height=400&width=400&text=Dinosaur+Shirt'], ARRAY['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'], ARRAY['Green', 'Blue', 'Orange'], 35, shirts_kids_id, graphic_theme_id, 'kids', 4.5, false, true),
    ('Summer Fun Shirt', 'Bright and colorful shirt perfect for summer adventures', 499, NULL, ARRAY['/placeholder.svg?height=400&width=400&text=Summer+Fun+Shirt'], ARRAY['2-3Y', '4-5Y', '6-7Y', '8-9Y'], ARRAY['Yellow', 'Orange', 'Turquoise'], 60, shirts_kids_id, summer_theme_id, 'kids', 4.3, false, false);

    -- Insert sample kids hoodies
    INSERT INTO products (name, description, price, original_price, images, sizes, colors, stock, category_id, theme_id, gender, rating, is_featured, is_on_sale) VALUES
    ('Cozy Bear Hoodie', 'Super soft hoodie with adorable bear design', 899, 1199, ARRAY['/placeholder.svg?height=400&width=400&text=Bear+Hoodie'], ARRAY['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'], ARRAY['Brown', 'Gray', 'Cream'], 30, hoodies_kids_id, NULL, 'kids', 4.7, true, true),
    ('Space Explorer Hoodie', 'Out-of-this-world hoodie for future astronauts', 949, NULL, ARRAY['/placeholder.svg?height=400&width=400&text=Space+Hoodie'], ARRAY['4-5Y', '6-7Y', '8-9Y', '10-11Y'], ARRAY['Navy', 'Black', 'Dark Blue'], 25, hoodies_kids_id, graphic_theme_id, 'kids', 4.6, true, false),
    ('Rainbow Cloud Hoodie', 'Dreamy hoodie with rainbow and cloud graphics', 849, 999, ARRAY['/placeholder.svg?height=400&width=400&text=Rainbow+Hoodie'], ARRAY['2-3Y', '4-5Y', '6-7Y', '8-9Y'], ARRAY['White', 'Light Blue', 'Pink'], 40, hoodies_kids_id, NULL, 'kids', 4.8, false, true),
    ('Animal Friends Hoodie', 'Cute hoodie featuring friendly animal characters', 799, NULL, ARRAY['/placeholder.svg?height=400&width=400&text=Animal+Hoodie'], ARRAY['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'], ARRAY['Green', 'Orange', 'Purple'], 45, hoodies_kids_id, graphic_theme_id, 'kids', 4.4, false, false);
END $$;
