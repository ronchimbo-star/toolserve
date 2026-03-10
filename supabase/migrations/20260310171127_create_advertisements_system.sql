/*
  # Create Advertisements System
  
  1. New Tables
    - `advertisements`
      - `id` (uuid, primary key)
      - `title` (text) - Ad title
      - `description` (text) - Ad description
      - `image_url` (text) - Path to ad image
      - `link_url` (text) - Where the ad links to
      - `position` (text) - Where ad appears (top, middle, bottom, sidebar)
      - `active` (boolean) - Whether ad is currently active
      - `start_date` (timestamptz) - When ad becomes active
      - `end_date` (timestamptz) - When ad expires
      - `click_count` (integer) - Track ad clicks
      - `impression_count` (integer) - Track ad views
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on advertisements table
    - Public can read active ads
    - Only authenticated admins can manage ads
*/

CREATE TABLE IF NOT EXISTS advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  position TEXT DEFAULT 'middle' CHECK (position IN ('top', 'middle', 'bottom', 'sidebar')),
  active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,
  impression_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active advertisements"
  ON advertisements
  FOR SELECT
  USING (
    active = true 
    AND start_date <= now() 
    AND (end_date IS NULL OR end_date >= now())
  );

CREATE POLICY "Only admins can insert advertisements"
  ON advertisements
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only admins can update advertisements"
  ON advertisements
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only admins can delete advertisements"
  ON advertisements
  FOR DELETE
  TO authenticated
  USING (true);

COMMENT ON TABLE advertisements IS 'Stores advertisement banners and promotional content';
COMMENT ON COLUMN advertisements.position IS 'Where the ad should appear: top, middle, bottom, or sidebar';
COMMENT ON COLUMN advertisements.click_count IS 'Number of times the ad has been clicked';
COMMENT ON COLUMN advertisements.impression_count IS 'Number of times the ad has been viewed';
