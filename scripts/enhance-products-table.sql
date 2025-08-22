-- Add new fields to products table for enhanced admin features
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS fabric_composition TEXT,
ADD COLUMN IF NOT EXISTS care_instructions TEXT,
ADD COLUMN IF NOT EXISTS size_chart TEXT,
ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(100);

-- Create fabric composition templates table
CREATE TABLE IF NOT EXISTS public.fabric_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    composition TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create care instructions templates table
CREATE TABLE IF NOT EXISTS public.care_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    instructions TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create size chart templates table
CREATE TABLE IF NOT EXISTS public.size_chart_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    manufacturer VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    chart_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default fabric composition templates
INSERT INTO public.fabric_templates (name, composition) VALUES
('Cotton Basic', '100% Cotton - Soft, breathable, and comfortable for everyday wear'),
('Cotton Blend', '60% Cotton, 40% Polyester - Durable blend with easy care properties'),
('Premium Cotton', '100% Premium Cotton - High-quality, pre-shrunk cotton with superior softness'),
('Denim Classic', '98% Cotton, 2% Elastane - Classic denim with slight stretch for comfort'),
('Polyester Sport', '100% Polyester - Moisture-wicking, quick-dry fabric perfect for active wear'),
('Wool Blend', '70% Wool, 30% Acrylic - Warm and cozy blend, perfect for winter wear');

-- Insert default care instructions templates
INSERT INTO public.care_templates (name, instructions) VALUES
('Cotton Care', 'Machine wash cold with like colors. Tumble dry low. Iron on medium heat if needed. Do not bleach.'),
('Delicate Care', 'Hand wash in cold water or machine wash on delicate cycle. Lay flat to dry. Do not wring or twist.'),
('Denim Care', 'Machine wash cold inside out with like colors. Tumble dry low or hang dry. Iron inside out if needed.'),
('Wool Care', 'Dry clean only or hand wash in cold water with wool detergent. Lay flat to dry away from direct heat.'),
('Synthetic Care', 'Machine wash warm. Tumble dry medium heat. Remove promptly to prevent wrinkles. Cool iron if needed.');

-- Insert default size chart templates
INSERT INTO public.size_chart_templates (manufacturer, category, chart_data) VALUES
('Standard', 'T-Shirts', '{"XS": {"chest": "32-34", "length": "26"}, "S": {"chest": "36-38", "length": "27"}, "M": {"chest": "40-42", "length": "28"}, "L": {"chest": "44-46", "length": "29"}, "XL": {"chest": "48-50", "length": "30"}}'),
('Standard', 'Jeans', '{"28": {"waist": "28", "inseam": "32"}, "30": {"waist": "30", "inseam": "32"}, "32": {"waist": "32", "inseam": "32"}, "34": {"waist": "34", "inseam": "32"}, "36": {"waist": "36", "inseam": "32"}}'),
('Premium', 'Shirts', '{"S": {"chest": "38-40", "length": "28", "sleeve": "24"}, "M": {"chest": "42-44", "length": "29", "sleeve": "25"}, "L": {"chest": "46-48", "length": "30", "sleeve": "26"}, "XL": {"chest": "50-52", "length": "31", "sleeve": "27"}}');

-- Enable RLS for new tables
ALTER TABLE public.fabric_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.size_chart_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage fabric templates" ON public.fabric_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
        )
    );

CREATE POLICY "Admins can manage care templates" ON public.care_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
        )
    );

CREATE POLICY "Admins can manage size chart templates" ON public.size_chart_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
        )
    );

-- Users can view templates for product details
CREATE POLICY "Users can view fabric templates" ON public.fabric_templates
    FOR SELECT USING (true);

CREATE POLICY "Users can view care templates" ON public.care_templates
    FOR SELECT USING (true);

CREATE POLICY "Users can view size chart templates" ON public.size_chart_templates
    FOR SELECT USING (true);
