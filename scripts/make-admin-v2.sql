-- First, ensure the user exists in auth.users (this should be done after signup)
-- Then update or insert into the users table

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Make user admin by email
INSERT INTO users (id, email, name, is_admin, created_at) 
VALUES (
  gen_random_uuid(),
  'stitchpopclothing@gmail.com',
  'Admin User',
  true,
  NOW()
) 
ON CONFLICT (email) 
DO UPDATE SET 
  is_admin = true,
  updated_at = NOW();

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_users_updated_at_column();

-- Verify the admin user
SELECT email, name, is_admin, created_at FROM users WHERE email = 'stitchpopclothing@gmail.com';
