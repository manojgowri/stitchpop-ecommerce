-- Add image_url column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add some sample category images for women's categories
UPDATE categories 
SET image_url = '/placeholder.svg?height=200&width=300&text=Dresses'
WHERE name = 'Dresses' AND gender = 'women';

UPDATE categories 
SET image_url = '/placeholder.svg?height=200&width=300&text=Tops'
WHERE name = 'Tops' AND gender = 'women';

UPDATE categories 
SET image_url = '/placeholder.svg?height=200&width=300&text=Jeans'
WHERE name = 'Jeans' AND gender = 'women';

UPDATE categories 
SET image_url = '/placeholder.svg?height=200&width=300&text=Jackets'
WHERE name = 'Jackets' AND gender = 'women';
