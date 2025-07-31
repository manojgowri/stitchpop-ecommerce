-- First, make sure you have signed up through the website
-- Then replace 'YOUR_USER_ID_HERE' with your actual user ID from Supabase Auth

-- Update user to be admin
UPDATE users SET is_admin = true WHERE id = 'e1e7f0ce-8109-4d91-b835-1eb4dfd1869f';

-- If the user doesn't exist in users table, create it
INSERT INTO users (id, email, name, is_admin) 
VALUES ('e1e7f0ce-8109-4d91-b835-1eb4dfd1869f', 'stitchpopclothing@gmail.com', 'Stitch POP Admin', true)
ON CONFLICT (id) DO UPDATE SET is_admin = true;
