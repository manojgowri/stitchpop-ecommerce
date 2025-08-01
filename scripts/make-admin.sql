-- Make a user admin by email
-- Replace 'your-email@example.com' with the actual email address

UPDATE users 
SET is_admin = true 
WHERE email = 'stitchpopclothing@gmail.com';

-- If the user doesn't exist in the users table yet, you can insert them
-- This is useful if they haven't completed the registration process
INSERT INTO users (id, email, name, is_admin, created_at, updated_at)
SELECT 
    auth.uid(),
    'stitchpopclothing@gmail.com',
    'Admin User',
    true,
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'stitchpopclothing@gmail.com'
);

-- Verify the admin user was created/updated
SELECT id, email, name, is_admin, created_at 
FROM users 
WHERE email = 'stitchpopclothing@gmail.com';
