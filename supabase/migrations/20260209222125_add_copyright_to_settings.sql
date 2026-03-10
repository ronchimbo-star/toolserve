/*
  # Add Copyright Text to Site Settings

  1. Changes
    - Adds copyright_text column to site_settings table
    - Adds company_name, company_email, company_phone, company_address columns (aliasing existing ones)
    - Inserts default copyright text
    
  2. Notes
    - Uses existing contact columns where available
    - Sets up default ToolServe copyright text
*/

-- Add copyright_text column
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS copyright_text text;

-- Add company info columns (these will duplicate some existing data but Footer expects these names)
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS company_email text,
ADD COLUMN IF NOT EXISTS company_phone text,
ADD COLUMN IF NOT EXISTS company_address text;

-- Update existing row with copyright text and company info
UPDATE site_settings
SET 
  copyright_text = 'Copyright © 2026 ToolServe. All rights reserved. | Repairing Tools, Reducing Waste',
  company_name = COALESCE(company_name, site_name, 'ToolServe'),
  company_email = COALESCE(company_email, contact_email, 'info@toolserve.co.uk'),
  company_phone = COALESCE(company_phone, contact_phone, '+44 (0)23 9000 0000'),
  company_address = COALESCE(company_address, contact_address, 'Portsmouth, UK')
WHERE id = (SELECT id FROM site_settings LIMIT 1);

-- If no settings exist, insert defaults
INSERT INTO site_settings (
  site_name,
  company_name,
  company_email,
  company_phone,
  company_address,
  copyright_text,
  contact_email,
  contact_phone,
  contact_address
)
SELECT 
  'ToolServe',
  'ToolServe',
  'info@toolserve.co.uk',
  '+44 (0)23 9000 0000',
  'Portsmouth, UK',
  'Copyright © 2026 ToolServe. All rights reserved. | Repairing Tools, Reducing Waste',
  'info@toolserve.co.uk',
  '+44 (0)23 9000 0000',
  'Portsmouth, UK'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);
