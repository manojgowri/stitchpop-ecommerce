-- First, ensure the user exists in auth.users (this should be done after signup)
-- Then update or insert into the users table

-- Update existing user to admin
UPDATE users 
SET is_admin = true 
WHERE email = 'stitchpopclothing@gmail.com';

-- If user doesn't exist in users table, insert them
-- Note: You need to replace 'USER_UUID_HERE' with the actual UUID from auth.users
-- You can get this from Supabase Auth > Users section

-- For now, let's create a generic admin user entry
INSERT INTO users (email, name, is_admin, created_at, updated_at)
VALUES ('stitchpopclothing@gmail.com', 'Admin User', true, NOW(), NOW())
ON CONFLICT (email) 
DO UPDATE SET 
    is_admin = true,
    updated_at = NOW();

-- Verify the admin user
SELECT email, name, is_admin, created_at FROM users WHERE email = 'stitchpopclothing@gmail.com';
