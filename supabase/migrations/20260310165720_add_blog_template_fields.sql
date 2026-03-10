/*
  # Add Blog Template Fields
  
  1. Schema Updates
    - Add `reading_time` field to blog_posts (integer for minutes)
    - Add `author` field to blog_posts (text)
    - Add `author_image` field to blog_posts (text URL)
    - Ensure all existing fields support the new template structure
  
  2. Notes
    - All fields are nullable to support gradual migration
    - Existing posts won't be affected
    - New posts can utilize full template features
*/

-- Add new fields to blog_posts table
DO $$
BEGIN
  -- Add reading_time column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'reading_time'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN reading_time INTEGER;
  END IF;

  -- Add author column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'author'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN author TEXT;
  END IF;

  -- Add author_image column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'author_image'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN author_image TEXT;
  END IF;
END $$;

-- Add helpful comments
COMMENT ON COLUMN blog_posts.reading_time IS 'Estimated reading time in minutes';
COMMENT ON COLUMN blog_posts.author IS 'Author name for the blog post';
COMMENT ON COLUMN blog_posts.author_image IS 'URL to author profile image';
