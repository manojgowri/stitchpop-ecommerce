-- Replace 'your-email@example.com' with your actual email address
UPDATE users 
SET is_admin = true 
WHERE email = 'stitchpopclothing@gmail.com';

-- If the user doesn't exist, create them as admin
INSERT INTO users (email, name, is_admin) 
VALUES ('stitchpopclothing@gmail.com', 'Admin User', true)
ON CONFLICT (email) 
DO UPDATE SET is_admin = true;
