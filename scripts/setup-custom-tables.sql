-- Create custom email templates table for storing branded email templates
CREATE TABLE IF NOT EXISTS public.email_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL UNIQUE,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert branded email templates
INSERT INTO public.email_templates (template_name, subject, html_content) VALUES
('signup_confirmation', 'Welcome to Stitch POP - Confirm Your Email', 
'<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Stitch POP</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #FFFFFF; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #D4D4D4; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #2B2B2B; padding: 30px; text-align: center;">
      <h1 style="color: #FFFFFF; margin: 0; font-size: 28px;">Welcome to Stitch POP</h1>
      <p style="color: #D4D4D4; margin: 10px 0 0 0; font-size: 16px;">Premium Fashion for Everyone</p>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="color: #2B2B2B; margin: 0 0 20px 0; font-size: 24px;">Confirm Your Email Address</h2>
      <p style="color: #B3B3B3; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
        Thank you for joining Stitch POP! Please confirm your email address to complete your registration and start shopping our premium collection.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{.ConfirmationURL}}" style="background-color: #2B2B2B; color: #FFFFFF; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">Confirm Email Address</a>
      </div>
      <p style="color: #B3B3B3; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
        If you did not create an account with Stitch POP, please ignore this email.
      </p>
    </div>
    <div style="background-color: #D4D4D4; padding: 20px 30px; text-align: center;">
      <p style="color: #2B2B2B; margin: 0; font-size: 14px;">© 2024 Stitch POP. All rights reserved.</p>
      <p style="color: #B3B3B3; margin: 5px 0 0 0; font-size: 12px;">www.stitchpop.in</p>
    </div>
  </div>
</body>
</html>'),

('password_reset', 'Reset Your Stitch POP Password', 
'<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password - Stitch POP</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #FFFFFF; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #D4D4D4; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #2B2B2B; padding: 30px; text-align: center;">
      <h1 style="color: #FFFFFF; margin: 0; font-size: 28px;">Stitch POP</h1>
      <p style="color: #D4D4D4; margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="color: #2B2B2B; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password</h2>
      <p style="color: #B3B3B3; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
        We received a request to reset your password for your Stitch POP account. Click the button below to create a new password.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{.ConfirmationURL}}" style="background-color: #2B2B2B; color: #FFFFFF; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #B3B3B3; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
        If you did not request a password reset, please ignore this email. Your password will remain unchanged.
      </p>
    </div>
    <div style="background-color: #D4D4D4; padding: 20px 30px; text-align: center;">
      <p style="color: #2B2B2B; margin: 0; font-size: 14px;">© 2024 Stitch POP. All rights reserved.</p>
      <p style="color: #B3B3B3; margin: 5px 0 0 0; font-size: 12px;">www.stitchpop.in</p>
    </div>
  </div>
</body>
</html>')
ON CONFLICT (template_name) DO UPDATE SET
  subject = EXCLUDED.subject,
  html_content = EXCLUDED.html_content,
  updated_at = NOW();

-- Enable RLS on the email_templates table
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading email templates
CREATE POLICY "Allow reading email templates" ON public.email_templates
  FOR SELECT USING (true);
