/*
  # Add SEO and Analytics Fields

  1. Changes to existing tables
    - `blog_posts` table
      - Add `meta_title` (text, nullable) - Custom SEO title, defaults to post title
    
    - `site_settings` table
      - Add `google_analytics_id` (text, nullable) - GA4 Measurement ID (e.g., G-XXXXXXXXXX)
      - Add `site_meta_title` (text, nullable) - Default site-wide meta title
      - Add `site_meta_description` (text, nullable) - Default site-wide meta description
      - Add `site_meta_keywords` (text, nullable) - Default site-wide meta keywords
      - Add `site_logo_url` (text, nullable) - Site logo for SEO/social sharing

  2. Notes
    - These fields enable complete SEO control from the admin dashboard
    - Google Analytics will be injected into the site header automatically
    - Blog posts can override default SEO values with custom meta data
*/

-- Add meta_title to blog_posts if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'meta_title'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN meta_title text;
  END IF;
END $$;

-- Add SEO and Analytics fields to site_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'google_analytics_id'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN google_analytics_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'site_meta_title'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN site_meta_title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'site_meta_description'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN site_meta_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'site_meta_keywords'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN site_meta_keywords text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'site_logo_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN site_logo_url text;
  END IF;
END $$;

-- Add default SEO values for existing blog posts
UPDATE blog_posts 
SET 
  meta_title = title,
  meta_description = COALESCE(meta_description, excerpt, SUBSTRING(content FROM 1 FOR 160)),
  meta_keywords = COALESCE(meta_keywords, category)
WHERE meta_title IS NULL OR meta_description IS NULL OR meta_keywords IS NULL;
