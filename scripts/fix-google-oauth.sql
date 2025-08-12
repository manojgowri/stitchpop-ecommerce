-- Enable Google OAuth provider in Supabase
-- This needs to be configured in Supabase Dashboard under Authentication > Providers

-- Update auth settings for better email confirmation
UPDATE auth.config 
SET 
  site_url = 'https://www.stitchpop.in/',
  email_confirm_url = 'https://www.stitchpop.in/auth/callback',
  password_reset_url = 'https://www.stitchpop.in/auth/reset-password'
WHERE id = 1;

-- Ensure email templates are properly configured
INSERT INTO auth.email_templates (template_type, subject, body_html) VALUES
('confirmation', 'Confirm your email - Stitch POP', 
'<h2>Welcome to Stitch POP!</h2>
<p>Please click the link below to confirm your email:</p>
<a href="{{ .ConfirmationURL }}">Confirm Email</a>'),

('recovery', 'Reset your password - Stitch POP',
'<h2>Reset your password</h2>
<p>Click the link below to reset your password:</p>
<a href="{{ .ConfirmationURL }}">Reset Password</a>')
ON CONFLICT (template_type) DO UPDATE SET
  subject = EXCLUDED.subject,
  body_html = EXCLUDED.body_html;
