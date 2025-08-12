-- Update Supabase Auth Configuration for stitchpop.in domain
-- This script configures the authentication settings for the new domain

-- Update site URL and redirect URLs in auth configuration
UPDATE auth.config 
SET 
  site_url = 'https://www.stitchpop.in',
  uri_allow_list = 'https://www.stitchpop.in/auth/callback,https://www.stitchpop.in/auth/reset-password,https://www.stitchpop.in'
WHERE true;

-- If the above doesn't work (table doesn't exist), you'll need to configure these manually in Supabase Dashboard:
-- 1. Go to Authentication > URL Configuration
-- 2. Set Site URL to: https://www.stitchpop.in
-- 3. Add Redirect URLs: 
--    - https://www.stitchpop.in/auth/callback
--    - https://www.stitchpop.in/auth/reset-password
-- 4. Go to Authentication > Providers > Google
-- 5. Enable Google OAuth and add your credentials
-- 6. Set redirect URL to: https://www.stitchpop.in/auth/callback

-- Create a custom email templates table for our application
CREATE TABLE IF NOT EXISTS public.email_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(100) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert custom email templates
INSERT INTO public.email_templates (template_name, subject, html_content) 
VALUES 
(
  'signup_confirmation',
  'Welcome to Stitch POP - Confirm Your Email',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Stitch POP</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #FFFFFF; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #D4D4D4; border-radius: 8px; }
    .header { background: linear-gradient(135deg, #2B2B2B 0%, #B3B3B3 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; color: #2B2B2B; }
    .button { display: inline-block; background: #2B2B2B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { background: #D4D4D4; padding: 20px; text-align: center; color: #2B2B2B; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Stitch POP</h1>
      <p>Premium Fashion for Everyone</p>
    </div>
    <div class="content">
      <h2>Confirm Your Email Address</h2>
      <p>Thank you for joining Stitch POP! Please confirm your email address to complete your registration.</p>
      <a href="{{confirmation_url}}" class="button">Confirm Email Address</a>
      <p>If the button doesn''t work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #B3B3B3;">{{confirmation_url}}</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Stitch POP. All rights reserved.</p>
      <p>Visit us at <a href="https://www.stitchpop.in">www.stitchpop.in</a></p>
    </div>
  </div>
</body>
</html>'
),
(
  'password_reset',
  'Reset Your Stitch POP Password',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password - Stitch POP</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #FFFFFF; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #D4D4D4; border-radius: 8px; }
    .header { background: linear-gradient(135deg, #2B2B2B 0%, #B3B3B3 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; color: #2B2B2B; }
    .button { display: inline-block; background: #2B2B2B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { background: #D4D4D4; padding: 20px; text-align: center; color: #2B2B2B; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset</h1>
      <p>Stitch POP Account Security</p>
    </div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password. Click the button below to create a new password.</p>
      <a href="{{reset_url}}" class="button">Reset Password</a>
      <p>If the button doesn''t work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #B3B3B3;">{{reset_url}}</p>
      <p><strong>Note:</strong> This link will expire in 1 hour for security reasons.</p>
      <p>If you didn''t request this password reset, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Stitch POP. All rights reserved.</p>
      <p>Visit us at <a href="https://www.stitchpop.in">www.stitchpop.in</a></p>
    </div>
  </div>
</body>
</html>'
)
ON CONFLICT (template_name) DO UPDATE SET
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- Enable RLS on email templates
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for email templates (admin access only)
CREATE POLICY "Admin can manage email templates" ON public.email_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'stitchpopclothing@gmail.com'
    )
  );
