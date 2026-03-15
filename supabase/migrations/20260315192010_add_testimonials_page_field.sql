/*
  # Add page field to testimonials

  1. Changes
    - Add `page` field to testimonials table to allow page-specific testimonials
    - Add index for efficient querying by page
    - Update existing testimonials to have 'home' as default page
  
  2. Notes
    - This allows us to show different testimonials on different pages
    - Pages: 'home', 'services', 'sustainability', 'service-coverage'
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'testimonials' AND column_name = 'page'
  ) THEN
    ALTER TABLE testimonials ADD COLUMN page text DEFAULT 'home';
    CREATE INDEX IF NOT EXISTS idx_testimonials_page ON testimonials(page);
  END IF;
END $$;

-- Update existing testimonials to be on home page
UPDATE testimonials SET page = 'home' WHERE page IS NULL;
