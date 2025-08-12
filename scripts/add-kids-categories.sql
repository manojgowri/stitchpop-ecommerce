-- Add kids categories to the database
INSERT INTO categories (name, description, gender, is_active) VALUES
('Shirts', 'Comfortable shirts for kids', 'kids', true),
('Hoodies', 'Cozy hoodies for kids', 'kids', true)
ON CONFLICT (name, gender) DO NOTHING;
