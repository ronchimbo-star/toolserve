/*
  # ToolServe Database Schema

  1. New Tables
    - repair_requests: Stores customer repair submissions
      - id, customer details, equipment details, status, timestamps
    - blog_posts: CMS for sustainability blog content
      - id, title, content, SEO fields, published status
  
  2. Security
    - Enable RLS on all tables
    - Public read for published blogs
    - Public insert for repair requests
    - Admin-only management access
*/

-- Create repair_requests table
CREATE TABLE IF NOT EXISTS repair_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  customer_address text,
  preferred_contact_method text DEFAULT 'email',
  preferred_contact_time text,
  equipment_type text NOT NULL,
  equipment_make text,
  equipment_model text,
  serial_number text,
  issue_description text NOT NULL,
  service_type text NOT NULL CHECK (service_type IN ('repair', 'servicing', 'bulk')),
  photo_urls jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'received' CHECK (status IN ('received', 'diagnosing', 'in_repair', 'completed', 'cancelled')),
  assigned_to uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  category text DEFAULT 'general',
  featured_image_url text,
  meta_description text,
  meta_keywords text,
  published boolean DEFAULT false,
  published_at timestamptz,
  author_id uuid REFERENCES auth.users(id),
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_repair_requests_status ON repair_requests(status);
CREATE INDEX IF NOT EXISTS idx_repair_requests_created ON repair_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Enable RLS
ALTER TABLE repair_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Repair requests policies
CREATE POLICY "Anyone can submit repair requests"
  ON repair_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all repair requests"
  ON repair_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update repair requests"
  ON repair_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Blog posts policies
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Authenticated users can manage all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_repair_requests_updated_at
  BEFORE UPDATE ON repair_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();