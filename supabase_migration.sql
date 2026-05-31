-- Supabase schema migration for new commercial scope checkbox fields
-- Run this in Supabase SQL Editor to add missing columns if the quotations table already exists.

ALTER TABLE quotations ADD COLUMN IF NOT EXISTS include_main_works BOOLEAN;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS include_installation BOOLEAN;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS include_mep_items BOOLEAN;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS include_surface_preparation BOOLEAN;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS include_testing BOOLEAN;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE;

-- Optional: add columns used by newer app versions if not already present
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS validity_days NUMERIC;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS valid_until DATE;
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS prepared_by VARCHAR(255);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS prepared_by_name VARCHAR(255);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS prepared_by_designation VARCHAR(255);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS prepared_by_phone VARCHAR(50);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS approved_by_name VARCHAR(255);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS approved_by_designation VARCHAR(255);
ALTER TABLE quotations ADD COLUMN IF NOT EXISTS approved_by_phone VARCHAR(50);
