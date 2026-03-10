/*
  # Add Testimonials, Policy Pages, and Logo Settings

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the person giving testimonial
      - `role` (text) - Their role/position
      - `content` (text) - The testimonial content
      - `image_url` (text, nullable) - URL to their profile image
      - `display_order` (integer) - Order in which to display testimonials
      - `is_active` (boolean) - Whether testimonial is currently shown
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `policy_pages`
      - `id` (uuid, primary key)
      - `page_type` (text) - 'terms', 'privacy', or 'cookies'
      - `title` (text) - Page title
      - `content` (text) - The policy content
      - `updated_at` (timestamp)

  2. Changes to `site_settings` table
    - Add `favicon_url` (text, nullable) - URL to site favicon
    - Add `header_logo_url` (text, nullable) - URL to header logo
    - Add `footer_logo_url` (text, nullable) - URL to footer logo
    - Add `cookie_consent_message` (text, nullable) - Custom cookie consent message

  3. Security
    - Enable RLS on `testimonials` table
    - Enable RLS on `policy_pages` table
    - Add policies for public read access
    - Add policies for authenticated admin write access

  4. Initial Data
    - Insert default policy pages
    - Insert sample testimonials
*/

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

-- Create policy pages table
CREATE TABLE IF NOT EXISTS policy_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Add logo fields to site_settings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'favicon_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN favicon_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'header_logo_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN header_logo_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'footer_logo_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN footer_logo_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'cookie_consent_message'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN cookie_consent_message text DEFAULT 'We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.';
  END IF;
END $$;

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_pages ENABLE ROW LEVEL SECURITY;

-- Testimonials policies
CREATE POLICY "Anyone can view active testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (true);

-- Policy pages policies
CREATE POLICY "Anyone can view policy pages"
  ON policy_pages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update policy pages"
  ON policy_pages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert policy pages"
  ON policy_pages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default policy pages
INSERT INTO policy_pages (page_type, title, content)
VALUES 
  ('terms', 'Terms and Conditions', 'Welcome to ToolServe. These terms and conditions outline the rules and regulations for the use of our services.

1. Introduction
By accessing and using ToolServe services, you accept and agree to be bound by the terms and provision of this agreement.

2. Services
ToolServe provides professional tool repair and maintenance services. We reserve the right to refuse service to anyone for any reason at any time.

3. Pricing and Payment
All prices are subject to change without notice. Payment is due upon completion of services unless otherwise agreed in writing.

4. Warranties
We warrant our workmanship for 90 days from the date of service. This warranty does not cover damage caused by misuse, normal wear and tear, or unauthorized modifications.

5. Limitation of Liability
ToolServe shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from the use or inability to use our services.

6. Changes to Terms
We reserve the right to modify these terms at any time. Please review these terms periodically for changes.

Last updated: ' || to_char(now(), 'Month DD, YYYY')),

  ('privacy', 'Privacy Policy', 'At ToolServe, we are committed to protecting your privacy and ensuring the security of your personal information.

1. Information We Collect
We collect information that you provide directly to us, including name, email address, phone number, and service details when you request repairs or contact us.

2. How We Use Your Information
- To provide and maintain our services
- To communicate with you about your repairs
- To send you updates and marketing communications (with your consent)
- To improve our services and customer experience

3. Information Sharing
We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our business.

4. Data Security
We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.

5. Your Rights
You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.

6. Cookies
We use cookies to enhance your experience on our website. You can choose to disable cookies through your browser settings.

7. Changes to Privacy Policy
We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.

Contact us at [your email] if you have any questions about this privacy policy.

Last updated: ' || to_char(now(), 'Month DD, YYYY')),

  ('cookies', 'Cookie Policy', 'This Cookie Policy explains how ToolServe uses cookies and similar technologies.

1. What Are Cookies?
Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience.

2. Types of Cookies We Use

Essential Cookies
These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.

Performance Cookies
These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.

Functionality Cookies
These cookies enable the website to remember choices you make and provide enhanced features.

3. Third-Party Cookies
We may use third-party services that set cookies on your device, such as analytics providers.

4. Managing Cookies
Most web browsers allow you to control cookies through their settings. You can choose to:
- Delete existing cookies
- Block future cookies
- Receive warnings before cookies are stored

Note that disabling cookies may affect the functionality of our website.

5. Changes to Cookie Policy
We may update this cookie policy from time to time to reflect changes in technology or legislation.

For more information about cookies, visit www.allaboutcookies.org

Last updated: ' || to_char(now(), 'Month DD, YYYY'))
ON CONFLICT (page_type) DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (name, role, content, display_order, is_active)
VALUES 
  ('John Smith', 'Local Tradesperson', 'ToolServe saved me hundreds by repairing my drill instead of replacing it. Professional service and quick turnaround!', 1, true),
  ('Portsmouth City Council', 'Council Client', 'A fantastic partner in our sustainability initiatives. ToolServe has helped us reduce waste and save budget on equipment.', 2, true),
  ('Maria Rodriguez', 'Homeowner', 'My old vacuum cleaner works like new again. Great service and very affordable. Highly recommend ToolServe!', 3, true)
ON CONFLICT DO NOTHING;