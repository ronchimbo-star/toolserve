/*
  # Media Library System

  1. New Tables
    - `media_library`
      - `id` (uuid, primary key)
      - `filename` (text) - Original filename
      - `storage_path` (text) - Path in Supabase Storage
      - `public_url` (text) - Public accessible URL
      - `file_type` (text) - MIME type
      - `file_size` (integer) - Size in bytes
      - `width` (integer, nullable) - Image width
      - `height` (integer, nullable) - Image height
      - `alt_text` (text, nullable) - Alt text for images
      - `caption` (text, nullable) - Caption for images
      - `uploaded_by` (uuid, nullable) - User who uploaded
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `media_library` table
    - Add policies for authenticated users to manage media
*/

CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  public_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL DEFAULT 0,
  width integer,
  height integer,
  alt_text text,
  caption text,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view media"
  ON media_library FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can upload media"
  ON media_library FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated users can update their media"
  ON media_library FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by)
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated users can delete their media"
  ON media_library FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_by ON media_library(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_library_file_type ON media_library(file_type);
CREATE INDEX IF NOT EXISTS idx_media_library_created_at ON media_library(created_at DESC);
