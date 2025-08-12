-- Create email templates table for customizable email content
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_type VARCHAR(50) NOT NULL UNIQUE,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default email templates
INSERT INTO email_templates (template_type, subject, html_content) VALUES
('signup_confirmation', 'Welcome to Stitch POP - Verify Your Email', 
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2B2B2B;">Welcome to Stitch POP!</h2>
  <p>Thank you for signing up. Please click the link below to verify your email address:</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{verification_url}}" style="background-color: #2B2B2B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Verify Email</a>
  </div>
  <p>If you didn''t create an account, you can safely ignore this email.</p>
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #D4D4D4;">
  <p style="color: #B3B3B3; font-size: 14px;">Best regards,<br>The Stitch POP Team</p>
</div>'),

('password_reset', 'Reset Your Stitch POP Password', 
'<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2B2B2B;">Reset Your Password</h2>
  <p>You requested to reset your password. Click the link below to create a new password:</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{reset_url}}" style="background-color: #2B2B2B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
  </div>
  <p>This link will expire in 1 hour. If you didn''t request this, you can safely ignore this email.</p>
  <hr style="margin: 30px 0; border: none; border-top: 1px solid #D4D4D4;">
  <p style="color: #B3B3B3; font-size: 14px;">Best regards,<br>The Stitch POP Team</p>
</div>');
