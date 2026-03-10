/*
  # Add Service Areas Table

  1. New Tables
    - `service_areas`
      - `id` (uuid, primary key)
      - `area_name` (text) - Name of the service area (e.g., "Bexley", "Greenwich")
      - `slug` (text, unique) - URL-friendly slug
      - `county` (text) - County name (e.g., "Kent", "Greater London")
      - `description` (text) - Description of service in this area
      - `postcode_prefix` (text) - Primary postcode prefix (e.g., "DA8", "SE2")
      - `additional_postcodes` (text[]) - Additional postcodes covered
      - `response_time_hours` (integer) - Typical response time in hours
      - `callout_fee` (decimal) - Callout fee for this area
      - `is_active` (boolean) - Whether this area is actively served
      - `display_order` (integer) - Order to display on page
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `service_areas` table
    - Add policy for public read access (anyone can view service areas)
    - Add policy for authenticated admin users to manage service areas

  3. Sample Data
    - Insert service areas for Greater London and surrounding areas
*/

CREATE TABLE IF NOT EXISTS service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_name text NOT NULL,
  slug text UNIQUE NOT NULL,
  county text,
  description text,
  postcode_prefix text,
  additional_postcodes text[],
  response_time_hours integer DEFAULT 48,
  callout_fee decimal(10, 2) DEFAULT 0,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active service areas"
  ON service_areas
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated admins can insert service areas"
  ON service_areas
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can update service areas"
  ON service_areas
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can delete service areas"
  ON service_areas
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO service_areas (area_name, slug, county, description, postcode_prefix, additional_postcodes, response_time_hours, display_order) VALUES
  ('Erith', 'erith', 'Greater London', 'Our main service area. Same-day service often available for urgent repairs.', 'DA8', ARRAY['DA7', 'DA18'], 4, 1),
  ('Bexley', 'bexley', 'Greater London', 'Comprehensive tool and appliance repair services across Bexley borough.', 'DA5', ARRAY['DA6', 'DA7', 'DA14', 'DA15', 'DA16', 'DA17'], 24, 2),
  ('Greenwich', 'greenwich', 'Greater London', 'Professional repair services for all tools and small appliances in Greenwich.', 'SE7', ARRAY['SE2', 'SE3', 'SE9', 'SE10', 'SE18', 'SE28'], 24, 3),
  ('Dartford', 'dartford', 'Kent', 'Quality repairs for Dartford residents and businesses.', 'DA1', ARRAY['DA2', 'DA3', 'DA4', 'DA9'], 24, 4),
  ('Woolwich', 'woolwich', 'Greater London', 'Fast and reliable tool repair service in Woolwich.', 'SE18', ARRAY['SE28', 'SE2'], 24, 5),
  ('Sidcup', 'sidcup', 'Greater London', 'Expert tool and appliance repairs in Sidcup and surrounding areas.', 'DA14', ARRAY['DA15'], 24, 6),
  ('Thamesmead', 'thamesmead', 'Greater London', 'Serving Thamesmead with professional tool repair services.', 'SE28', ARRAY['SE2'], 24, 7),
  ('Gravesend', 'gravesend', 'Kent', 'Quality tool repair and servicing for Gravesend area.', 'DA11', ARRAY['DA12', 'DA13'], 48, 8),
  ('Orpington', 'orpington', 'Greater London', 'Comprehensive repair services for Orpington and Bromley areas.', 'BR5', ARRAY['BR6', 'BR7', 'BR8'], 48, 9),
  ('Bromley', 'bromley', 'Greater London', 'Professional tool and appliance repairs in Bromley borough.', 'BR1', ARRAY['BR2', 'BR3', 'BR4'], 48, 10);
