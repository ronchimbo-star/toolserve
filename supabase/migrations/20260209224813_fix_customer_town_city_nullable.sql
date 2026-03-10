/*
  # Fix customer_town_city column to be nullable

  1. Changes
    - Make `customer_town_city` column nullable in `repair_requests` table
    - This column was causing 400 errors on form submission since it's not required
    
  2. Reason
    - Customer town/city is optional information
    - Form doesn't collect this field
    - Should not block repair request submissions
*/

-- Make customer_town_city nullable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_requests' 
    AND column_name = 'customer_town_city'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE repair_requests ALTER COLUMN customer_town_city DROP NOT NULL;
  END IF;
END $$;
