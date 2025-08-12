-- Fixed SQL script to work with existing Supabase structure
-- Update site URL and redirect URLs in Supabase auth settings
-- Note: These settings are typically configured in the Supabase Dashboard
-- under Authentication > URL Configuration

-- For Supabase projects, these URLs should be set in the dashboard:
-- Site URL: https://www.stitchpop.in
-- Redirect URLs: 
--   - https://www.stitchpop.in/auth/callback
--   - https://www.stitchpop.in/auth/reset-password

-- Create custom email templates if they don't exist
DO $$
BEGIN
    -- Check if auth schema exists and has the right structure
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth') THEN
        -- Update email templates for better branding
        UPDATE auth.email_templates 
        SET 
            subject = 'Welcome to Stitch POP - Confirm your email',
            body_html = '
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <div style="background-color: #2b2b2b; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0;">Stitch POP</h1>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                    <h2 style="color: #2b2b2b; margin-bottom: 20px;">Welcome to Stitch POP!</h2>
                    <p style="color: #666666; line-height: 1.6; margin-bottom: 25px;">
                        Thank you for joining our premium fashion community. Please confirm your email address to complete your registration.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{ .ConfirmationURL }}" style="background-color: #2b2b2b; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Confirm Email Address
                        </a>
                    </div>
                    <p style="color: #999999; font-size: 14px; margin-top: 30px;">
                        If you did not create an account, please ignore this email.
                    </p>
                </div>
            </div>'
        WHERE template_type = 'confirmation';

        UPDATE auth.email_templates 
        SET 
            subject = 'Reset your Stitch POP password',
            body_html = '
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <div style="background-color: #2b2b2b; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0;">Stitch POP</h1>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                    <h2 style="color: #2b2b2b; margin-bottom: 20px;">Reset Your Password</h2>
                    <p style="color: #666666; line-height: 1.6; margin-bottom: 25px;">
                        We received a request to reset your password. Click the button below to create a new password.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{{ .ConfirmationURL }}" style="background-color: #2b2b2b; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #999999; font-size: 14px; margin-top: 30px;">
                        If you did not request this password reset, please ignore this email.
                    </p>
                </div>
            </div>'
        WHERE template_type = 'recovery';
    END IF;
END $$;
