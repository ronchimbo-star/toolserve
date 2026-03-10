/*
  # Add Quote Management System

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `repair_request_id` (uuid, foreign key to repair_requests)
      - `quote_number` (text, unique) - human-readable quote number
      - `customer_name` (text)
      - `customer_email` (text)
      - `equipment_type` (text)
      - `issue_description` (text)
      - `items` (jsonb) - array of line items with description, quantity, price
      - `subtotal` (decimal)
      - `vat` (decimal)
      - `total` (decimal)
      - `notes` (text) - additional notes or terms
      - `status` (text) - pending, accepted, declined, expired
      - `valid_until` (date) - quote expiry date
      - `sent_at` (timestamp)
      - `responded_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `quotes` table
    - Add policy for authenticated users to view all quotes
    - Add policy for authenticated users to insert quotes
    - Add policy for authenticated users to update quotes
    - Add policy for customers to view their own quotes by email

  3. Indexes
    - Index on repair_request_id for fast lookups
    - Index on customer_email for customer access
    - Index on status for filtering
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repair_request_id uuid REFERENCES repair_requests(id) ON DELETE SET NULL,
  quote_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  equipment_type text NOT NULL,
  issue_description text,
  items jsonb DEFAULT '[]'::jsonb,
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  vat decimal(10,2) NOT NULL DEFAULT 0,
  total decimal(10,2) NOT NULL DEFAULT 0,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  valid_until date,
  sent_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert quotes"
  ON quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update quotes"
  ON quotes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Customers can view their own quotes"
  ON quotes
  FOR SELECT
  TO public
  USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE INDEX IF NOT EXISTS idx_quotes_repair_request_id ON quotes(repair_request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_email ON quotes(customer_email);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON quotes(quote_number);

CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS text AS $$
DECLARE
  new_number text;
  year_part text;
  sequence_part int;
BEGIN
  year_part := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 4) AS INTEGER)), 0) + 1
  INTO sequence_part
  FROM quotes
  WHERE quote_number LIKE 'Q' || year_part || '%';
  
  new_number := 'Q' || year_part || LPAD(sequence_part::text, 5, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_quotes_updated_at();
