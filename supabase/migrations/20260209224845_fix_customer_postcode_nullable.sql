/*
  # Fix customer_postcode column to be nullable

  1. Changes
    - Make `customer_postcode` column nullable in `repair_requests` table
    - This column was causing potential issues since form doesn't collect it
    
  2. Reason
    - Customer postcode is not collected in the repair request form
    - Should not block repair request submissions
    - Can be collected later if needed
*/

-- Make customer_postcode nullable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_requests' 
    AND column_name = 'customer_postcode'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE repair_requests ALTER COLUMN customer_postcode DROP NOT NULL;
  END IF;
END $$;
