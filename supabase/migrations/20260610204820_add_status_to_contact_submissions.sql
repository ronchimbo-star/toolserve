ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS notes text;

-- Update the database company address
UPDATE site_settings SET company_address = 'Unit 2 Capital Industrial Estate, Crabtree Manorway, South Belvedere, DA17 6BJ'
WHERE company_address LIKE '%56 Craydene%' OR company_address LIKE '%DA8 2HA%' OR company_address = '';
