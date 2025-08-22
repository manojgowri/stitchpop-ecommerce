-- Create coupons table for discount management
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
    minimum_order_amount NUMERIC(10,2) DEFAULT 0,
    maximum_discount_amount NUMERIC(10,2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_dates CHECK (expiry_date > valid_from),
    CONSTRAINT valid_usage CHECK (used_count <= usage_limit OR usage_limit IS NULL)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_dates ON public.coupons(valid_from, expiry_date);

-- Create function to automatically uppercase coupon codes
CREATE OR REPLACE FUNCTION uppercase_coupon_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.code = UPPER(NEW.code);
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically uppercase coupon codes
DROP TRIGGER IF EXISTS trigger_uppercase_coupon_code ON public.coupons;
CREATE TRIGGER trigger_uppercase_coupon_code
    BEFORE INSERT OR UPDATE ON public.coupons
    FOR EACH ROW
    EXECUTE FUNCTION uppercase_coupon_code();

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage all coupons" ON public.coupons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
        )
    );

CREATE POLICY "Users can view active coupons" ON public.coupons
    FOR SELECT USING (is_active = true AND NOW() BETWEEN valid_from AND expiry_date);

-- Insert some sample coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, minimum_order_amount, maximum_discount_amount, usage_limit, valid_from, expiry_date) VALUES
('WELCOME10', 'Welcome discount for new customers', 'percentage', 10.00, 500.00, 200.00, 100, NOW(), NOW() + INTERVAL '30 days'),
('SAVE50', 'Flat ₹50 off on orders above ₹999', 'fixed', 50.00, 999.00, NULL, 500, NOW(), NOW() + INTERVAL '60 days'),
('FESTIVE25', 'Festive season special - 25% off', 'percentage', 25.00, 1500.00, 500.00, 200, NOW(), NOW() + INTERVAL '15 days');
