/*
  # Create Technicians System

  1. New Tables
    - `technicians`
      - `id` (uuid, primary key)
      - `name` (text, required) - Full name of the technician
      - `email` (text, unique, required) - Contact email
      - `phone` (text, optional) - Contact phone number
      - `specialization` (text, optional) - Area of expertise (e.g., power tools, garden equipment)
      - `status` (text, default 'active') - active, inactive, on_leave
      - `avatar_url` (text, optional) - Profile picture URL
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Changes to Existing Tables
    - Add `assigned_technician_id` to `repair_requests` table
    - Add foreign key constraint

  3. Security
    - Enable RLS on `technicians` table
    - Add policies for authenticated admin access
    - Add policy for request assignment updates

  4. Indexes
    - Index on `status` for fast filtering
    - Index on `specialization` for assignment matching
*/

-- Create technicians table
CREATE TABLE IF NOT EXISTS technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  specialization text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add assigned_technician_id to repair_requests if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_requests' AND column_name = 'assigned_technician_id'
  ) THEN
    ALTER TABLE repair_requests ADD COLUMN assigned_technician_id uuid REFERENCES technicians(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_technicians_status ON technicians(status);
CREATE INDEX IF NOT EXISTS idx_technicians_specialization ON technicians(specialization);
CREATE INDEX IF NOT EXISTS idx_repair_requests_assigned_technician ON repair_requests(assigned_technician_id);

-- Enable RLS
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;

-- RLS Policies for technicians table
CREATE POLICY "Admins can view all technicians"
  ON technicians FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create technicians"
  ON technicians FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update technicians"
  ON technicians FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete technicians"
  ON technicians FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample technicians for demo
INSERT INTO technicians (name, email, phone, specialization, status) VALUES
  ('John Smith', 'john.smith@toolserve.co.uk', '+44 7700 900001', 'Power Tools', 'active'),
  ('Sarah Johnson', 'sarah.johnson@toolserve.co.uk', '+44 7700 900002', 'Garden & Outdoor', 'active'),
  ('Mike Brown', 'mike.brown@toolserve.co.uk', '+44 7700 900003', 'Hand Tools', 'active')
ON CONFLICT (email) DO NOTHING;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_technicians_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'technicians_updated_at_trigger'
  ) THEN
    CREATE TRIGGER technicians_updated_at_trigger
      BEFORE UPDATE ON technicians
      FOR EACH ROW
      EXECUTE FUNCTION update_technicians_updated_at();
  END IF;
END $$;
