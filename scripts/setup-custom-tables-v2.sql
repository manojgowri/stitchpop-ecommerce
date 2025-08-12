-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS email_templates;
DROP TABLE IF EXISTS banners;

-- Create email_templates table with correct structure
CREATE TABLE email_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create banners table for homepage slider
CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    redirect_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert email templates with professional branding
INSERT INTO email_templates (template_name, subject, html_content) VALUES 
(
    'signup_confirmation',
    'Welcome to Stitch POP - Confirm Your Account',
    '<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Welcome to Stitch POP</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #2B2B2B; background-color: #FFFFFF; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #D4D4D4; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #2B2B2B 0%, #B3B3B3 100%); padding: 30px; text-align: center;">
                <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Stitch POP</h1>
                <p style="color: #D4D4D4; margin: 10px 0 0 0; font-size: 16px;">Premium Fashion for Everyone</p>
            </div>
            <div style="padding: 40px 30px;">
                <h2 style="color: #2B2B2B; margin: 0 0 20px 0; font-size: 24px;">Confirm Your Account</h2>
                <p style="color: #2B2B2B; margin: 0 0 25px 0; font-size: 16px;">
                    Thank you for joining Stitch POP! Please confirm your email address to complete your registration and start shopping our premium collection.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{.ConfirmationURL}}" style="display: inline-block; background-color: #2B2B2B; color: #FFFFFF; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                        Confirm Your Email
                    </a>
                </div>
                <p style="color: #B3B3B3; font-size: 14px; margin: 25px 0 0 0;">
                    If you did not create an account, please ignore this email.
                </p>
            </div>
            <div style="background-color: #D4D4D4; padding: 20px 30px; text-align: center;">
                <p style="color: #2B2B2B; margin: 0; font-size: 14px;">
                    © 2024 Stitch POP. All rights reserved.<br>
                    <a href="https://www.stitchpop.in" style="color: #2B2B2B; text-decoration: none;">www.stitchpop.in</a>
                </p>
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
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #2B2B2B; background-color: #FFFFFF; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #D4D4D4; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #2B2B2B 0%, #B3B3B3 100%); padding: 30px; text-align: center;">
                <h1 style="color: #FFFFFF; margin: 0; font-size: 28px; font-weight: bold;">Stitch POP</h1>
                <p style="color: #D4D4D4; margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
            </div>
            <div style="padding: 40px 30px;">
                <h2 style="color: #2B2B2B; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password</h2>
                <p style="color: #2B2B2B; margin: 0 0 25px 0; font-size: 16px;">
                    We received a request to reset your password. Click the button below to create a new password for your Stitch POP account.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{.ConfirmationURL}}" style="display: inline-block; background-color: #2B2B2B; color: #FFFFFF; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #B3B3B3; font-size: 14px; margin: 25px 0 0 0;">
                    If you did not request a password reset, please ignore this email. Your password will remain unchanged.
                </p>
            </div>
            <div style="background-color: #D4D4D4; padding: 20px 30px; text-align: center;">
                <p style="color: #2B2B2B; margin: 0; font-size: 14px;">
                    © 2024 Stitch POP. All rights reserved.<br>
                    <a href="https://www.stitchpop.in" style="color: #2B2B2B; text-decoration: none;">www.stitchpop.in</a>
                </p>
            </div>
        </div>
    </body>
    </html>'
);

-- Insert sample banners for homepage slider
INSERT INTO banners (title, image_url, redirect_url, display_order) VALUES 
(
    'New Collection Launch',
    '/placeholder.svg?height=400&width=800',
    '/categories',
    1
),
(
    'Summer Sale',
    '/placeholder.svg?height=400&width=800',
    '/stitch-drop',
    2
),
(
    'Premium Quality',
    '/placeholder.svg?height=400&width=800',
    '/about',
    3
);

-- Enable Row Level Security
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Create policies for email_templates (admin only)
CREATE POLICY "Admin can manage email templates" ON email_templates
    FOR ALL USING (auth.jwt() ->> 'email' = 'stitchpopclothing@gmail.com');

-- Create policies for banners (admin can manage, public can read)
CREATE POLICY "Public can view active banners" ON banners
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage banners" ON banners
    FOR ALL USING (auth.jwt() ->> 'email' = 'stitchpopclothing@gmail.com');
