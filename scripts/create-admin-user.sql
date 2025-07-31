-- Create admin user
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from Supabase Auth

-- Example user ID (replace with your actual ID)
UPDATE users 
SET is_admin = true 
WHERE email = 'e1e7f0ce-8109-4d91-b835-1eb4dfd1869f';

-- Alternative: Update by user ID if you know it
-- UPDATE users SET is_admin = true WHERE id = 'your-user-id-here';

-- To find your user ID:
-- 1. Sign up through the app
-- 2. Go to Supabase Dashboard > Authentication > Users
-- 3. Find your user and copy the ID
-- 4. Replace in the query above
