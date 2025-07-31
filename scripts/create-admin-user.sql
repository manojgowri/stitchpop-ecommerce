-- Create admin user
-- First, you need to sign up normally through the app, then run this script with your user ID

-- Replace 'YOUR_USER_ID_HERE' with the actual user ID from Supabase Auth
UPDATE users 
SET is_admin = true 
WHERE id = 'e1e7f0ce-8109-4d91-b835-1eb4dfd1869f';

-- Example: If your user ID is 'abc123-def456-ghi789'
-- UPDATE users SET is_admin = true WHERE id = 'abc123-def456-ghi789';

-- To find your user ID, you can:
-- 1. Sign up through the app
-- 2. Check the Supabase dashboard > Authentication > Users
-- 3. Copy your user ID and replace it in the query above
