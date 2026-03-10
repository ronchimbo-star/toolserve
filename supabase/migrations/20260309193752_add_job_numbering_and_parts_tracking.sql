/*
  # Add Job Numbering and Parts Tracking System

  1. Job Numbering System
    - Add `job_number` (text) to repair_requests table - unique formatted identifier (e.g., "JOB-2024-001")
    - Add sequence for auto-incrementing job numbers
    - Add trigger to auto-generate job numbers on insert
    
  2. Parts Tracking System
    - Create `repair_parts` table to track parts used in repairs
      - `id` (uuid, primary key)
      - `repair_request_id` (uuid, foreign key to repair_requests)
      - `part_name` (text) - Name/description of the part
      - `part_number` (text) - Manufacturer part number
      - `quantity` (integer) - Number of parts used
      - `unit_cost` (decimal) - Cost per unit
      - `total_cost` (decimal) - Calculated total (quantity * unit_cost)
      - `supplier` (text) - Where the part was sourced
      - `notes` (text) - Additional notes about the part
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
  3. Enhanced Quotes System
    - Add `labor_cost` (decimal) to quotes table
    - Add `parts_cost` (decimal) to quotes table  
    - Add `additional_costs` (decimal) to quotes table (for misc fees)
    - Add `cost_breakdown` (jsonb) to quotes table for detailed line items
    - Update existing `valid_until` (already exists)
    - Update existing `notes` (already exists)
    
  4. Security
    - Enable RLS on `repair_parts` table
    - Add policies for authenticated admin access
*/

-- Add job number to repair_requests table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_requests' AND column_name = 'job_number'
  ) THEN
    ALTER TABLE repair_requests ADD COLUMN job_number text UNIQUE;
  END IF;
END $$;

-- Create sequence for job numbers
CREATE SEQUENCE IF NOT EXISTS job_number_seq START 1;

-- Function to generate job number
CREATE OR REPLACE FUNCTION generate_job_number()
RETURNS text AS $$
DECLARE
  next_num integer;
  year_part text;
  num_part text;
BEGIN
  next_num := nextval('job_number_seq');
  year_part := to_char(CURRENT_DATE, 'YYYY');
  num_part := lpad(next_num::text, 4, '0');
  RETURN 'JOB-' || year_part || '-' || num_part;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate job number
CREATE OR REPLACE FUNCTION set_job_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.job_number IS NULL THEN
    NEW.job_number := generate_job_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_job_number ON repair_requests;
CREATE TRIGGER trigger_set_job_number
  BEFORE INSERT ON repair_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_job_number();

-- Backfill existing records with job numbers
UPDATE repair_requests 
SET job_number = generate_job_number()
WHERE job_number IS NULL;

-- Create repair_parts table
CREATE TABLE IF NOT EXISTS repair_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_request_id uuid NOT NULL REFERENCES repair_requests(id) ON DELETE CASCADE,
  part_name text NOT NULL,
  part_number text,
  quantity integer NOT NULL DEFAULT 1,
  unit_cost decimal(10,2) NOT NULL DEFAULT 0.00,
  total_cost decimal(10,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
  supplier text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT positive_unit_cost CHECK (unit_cost >= 0)
);

-- Enable RLS on repair_parts
ALTER TABLE repair_parts ENABLE ROW LEVEL SECURITY;

-- Policies for repair_parts
CREATE POLICY "Authenticated users can view repair parts"
  ON repair_parts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert repair parts"
  ON repair_parts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update repair parts"
  ON repair_parts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete repair parts"
  ON repair_parts FOR DELETE
  TO authenticated
  USING (true);

-- Add enhanced quote fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'labor_cost'
  ) THEN
    ALTER TABLE quotes ADD COLUMN labor_cost decimal(10,2) DEFAULT 0.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'parts_cost'
  ) THEN
    ALTER TABLE quotes ADD COLUMN parts_cost decimal(10,2) DEFAULT 0.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'additional_costs'
  ) THEN
    ALTER TABLE quotes ADD COLUMN additional_costs decimal(10,2) DEFAULT 0.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'cost_breakdown'
  ) THEN
    ALTER TABLE quotes ADD COLUMN cost_breakdown jsonb;
  END IF;
END $$;

-- Update trigger for repair_parts
CREATE OR REPLACE FUNCTION update_repair_parts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_repair_parts_timestamp ON repair_parts;
CREATE TRIGGER trigger_update_repair_parts_timestamp
  BEFORE UPDATE ON repair_parts
  FOR EACH ROW
  EXECUTE FUNCTION update_repair_parts_timestamp();

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_repair_parts_repair_request_id ON repair_parts(repair_request_id);
CREATE INDEX IF NOT EXISTS idx_repair_requests_job_number ON repair_requests(job_number);

-- Add comments for documentation
COMMENT ON TABLE repair_parts IS 'Tracks individual parts used in repairs for accurate cost tracking and inventory management';
COMMENT ON COLUMN repair_requests.job_number IS 'Unique formatted job identifier (e.g., JOB-2024-0001)';
COMMENT ON COLUMN quotes.cost_breakdown IS 'Detailed breakdown of costs in JSON format for transparency';
COMMENT ON COLUMN quotes.labor_cost IS 'Cost of labor for the repair';
COMMENT ON COLUMN quotes.parts_cost IS 'Total cost of parts used in the repair';
COMMENT ON COLUMN quotes.additional_costs IS 'Additional costs such as callout fees, disposal fees, etc.';
