-- Create admin user
-- Replace the email with your actual email address

-- Update user to admin by email
UPDATE users 
SET is_admin = true 
WHERE email = 'stitchpopclothing@gmail.com';

-- Alternative: Update by user ID if you know it (UID from Supabase)
-- UPDATE users SET is_admin = true WHERE id = 'e1e7f0ce-8109-4d91-b835-1eb4dfd1869f';

-- To find your user:
-- 1. Sign up through the app with stitchpopclothing@gmail.com
-- 2. Go to Supabase Dashboard > Authentication > Users
-- 3. Find your user and copy the ID (UID column)
-- 4. Use either email or ID in the query above
