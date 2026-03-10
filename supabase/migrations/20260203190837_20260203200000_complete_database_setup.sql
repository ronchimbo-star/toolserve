/*
  # Complete Database Setup

  This migration ensures all required tables exist for ToolServe.
  Safe to run multiple times due to IF NOT EXISTS clauses.

  1. Core Tables
    - site_settings - Site configuration
    - repair_requests - Customer repair submissions  
    - blog_posts - Blog content
    - chat_conversations - Chatbot history
    - quotes - Customer quotes
    - testimonials - Customer testimonials
    - policy_pages - Terms, privacy, cookies
    - faqs - Frequently asked questions
    - admin_tokens - Admin access tokens (legacy)
    - admin_recovery_tokens - Password recovery

  2. Security
    - Enable RLS on all tables
    - Appropriate policies for each table
*/

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text DEFAULT 'ToolServe',
  tagline text DEFAULT 'Professional Tool Repair & Servicing',
  contact_email text,
  contact_phone text,
  contact_address text,
  business_hours text,
  service_areas text[],
  favicon_url text,
  header_logo_url text,
  footer_logo_url text,
  cookie_consent_message text DEFAULT 'We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_message text NOT NULL,
  assistant_message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  user_email text,
  context_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create quotes table
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

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  image_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create policy_pages table
CREATE TABLE IF NOT EXISTS policy_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_tokens table (legacy)
CREATE TABLE IF NOT EXISTS admin_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create admin_recovery_tokens table
CREATE TABLE IF NOT EXISTS admin_recovery_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  email text NOT NULL,
  used boolean DEFAULT false,
  used_at timestamptz,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_repair_requests_status ON repair_requests(status);
CREATE INDEX IF NOT EXISTS idx_repair_requests_created ON repair_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_session ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_quotes_repair_request_id ON quotes(repair_request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_email ON quotes(customer_email);

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_recovery_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Site settings policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Anyone can view site settings') THEN
    CREATE POLICY "Anyone can view site settings" ON site_settings FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Authenticated users can update site settings') THEN
    CREATE POLICY "Authenticated users can update site settings" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Authenticated users can insert site settings') THEN
    CREATE POLICY "Authenticated users can insert site settings" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

-- Repair requests policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'repair_requests' AND policyname = 'Anyone can submit repair requests') THEN
    CREATE POLICY "Anyone can submit repair requests" ON repair_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'repair_requests' AND policyname = 'Authenticated users can view all repair requests') THEN
    CREATE POLICY "Authenticated users can view all repair requests" ON repair_requests FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'repair_requests' AND policyname = 'Authenticated users can update repair requests') THEN
    CREATE POLICY "Authenticated users can update repair requests" ON repair_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Blog posts policies  
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Anyone can view published blog posts') THEN
    CREATE POLICY "Anyone can view published blog posts" ON blog_posts FOR SELECT TO anon, authenticated USING (published = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Authenticated users can manage all blog posts') THEN
    CREATE POLICY "Authenticated users can manage all blog posts" ON blog_posts FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Authenticated users can create blog posts') THEN
    CREATE POLICY "Authenticated users can create blog posts" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Authenticated users can update blog posts') THEN
    CREATE POLICY "Authenticated users can update blog posts" ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Authenticated users can delete blog posts') THEN
    CREATE POLICY "Authenticated users can delete blog posts" ON blog_posts FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- Chat conversations policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_conversations' AND policyname = 'Anyone can insert chat conversations') THEN
    CREATE POLICY "Anyone can insert chat conversations" ON chat_conversations FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_conversations' AND policyname = 'Authenticated users can view all conversations') THEN
    CREATE POLICY "Authenticated users can view all conversations" ON chat_conversations FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Quotes policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quotes' AND policyname = 'Authenticated users can view all quotes') THEN
    CREATE POLICY "Authenticated users can view all quotes" ON quotes FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quotes' AND policyname = 'Authenticated users can insert quotes') THEN
    CREATE POLICY "Authenticated users can insert quotes" ON quotes FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quotes' AND policyname = 'Authenticated users can update quotes') THEN
    CREATE POLICY "Authenticated users can update quotes" ON quotes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Testimonials policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Anyone can view active testimonials') THEN
    CREATE POLICY "Anyone can view active testimonials" ON testimonials FOR SELECT TO public USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Authenticated users can view all testimonials') THEN
    CREATE POLICY "Authenticated users can view all testimonials" ON testimonials FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Authenticated users can insert testimonials') THEN
    CREATE POLICY "Authenticated users can insert testimonials" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Authenticated users can update testimonials') THEN
    CREATE POLICY "Authenticated users can update testimonials" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Authenticated users can delete testimonials') THEN
    CREATE POLICY "Authenticated users can delete testimonials" ON testimonials FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- Policy pages policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'policy_pages' AND policyname = 'Anyone can view policy pages') THEN
    CREATE POLICY "Anyone can view policy pages" ON policy_pages FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'policy_pages' AND policyname = 'Authenticated users can update policy pages') THEN
    CREATE POLICY "Authenticated users can update policy pages" ON policy_pages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'policy_pages' AND policyname = 'Authenticated users can insert policy pages') THEN
    CREATE POLICY "Authenticated users can insert policy pages" ON policy_pages FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

-- FAQs policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'Anyone can view active FAQs') THEN
    CREATE POLICY "Anyone can view active FAQs" ON faqs FOR SELECT TO public USING (is_active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'Authenticated users can view all FAQs') THEN
    CREATE POLICY "Authenticated users can view all FAQs" ON faqs FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'Authenticated users can insert FAQs') THEN
    CREATE POLICY "Authenticated users can insert FAQs" ON faqs FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'Authenticated users can update FAQs') THEN
    CREATE POLICY "Authenticated users can update FAQs" ON faqs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'Authenticated users can delete FAQs') THEN
    CREATE POLICY "Authenticated users can delete FAQs" ON faqs FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- Admin tokens policies (legacy)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_tokens' AND policyname = 'Users can read own tokens') THEN
    CREATE POLICY "Users can read own tokens" ON admin_tokens FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_tokens' AND policyname = 'Allow anonymous token validation') THEN
    CREATE POLICY "Allow anonymous token validation" ON admin_tokens FOR SELECT TO anon USING (true);
  END IF;
END $$;

-- Admin recovery tokens policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_recovery_tokens' AND policyname = 'Anyone can read recovery tokens for validation') THEN
    CREATE POLICY "Anyone can read recovery tokens for validation" ON admin_recovery_tokens FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_recovery_tokens' AND policyname = 'Anyone can mark token as used') THEN
    CREATE POLICY "Anyone can mark token as used" ON admin_recovery_tokens FOR UPDATE TO public USING (true) WITH CHECK (used = true);
  END IF;
END $$;

-- Admin notifications policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_notifications' AND policyname = 'Authenticated users can view notifications') THEN
    CREATE POLICY "Authenticated users can view notifications" ON admin_notifications FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_notifications' AND policyname = 'Authenticated users can update notifications') THEN
    CREATE POLICY "Authenticated users can update notifications" ON admin_notifications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_notifications' AND policyname = 'System can insert notifications') THEN
    CREATE POLICY "System can insert notifications" ON admin_notifications FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
END $$;