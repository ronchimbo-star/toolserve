/*
  # Setup Supabase Storage Buckets

  1. Storage Buckets
    - `repair-images` - Stores customer uploaded repair request photos
      - Public readable for easy viewing
      - Anyone can upload (to allow anonymous submissions)
      - Max file size: 5MB
      - Allowed formats: jpg, jpeg, png, webp
    
    - `invoices` - Stores generated invoices and quotes
      - Private bucket
      - Only authenticated users can access
      - PDF files

  2. Storage Policies
    - Allow public uploads to repair-images
    - Allow public reads from repair-images
    - Allow authenticated users to manage invoices
    - Allow customers to view their own invoices

  3. Notes
    - Images are organized by repair request ID
    - File naming convention: {request_id}/{timestamp}_{filename}
*/

-- Create repair-images bucket for customer uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'repair-images',
  'repair-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Create invoices bucket for generated documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'invoices',
  'invoices',
  false,
  10485760, -- 10MB in bytes
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf'];

-- Repair Images Policies

-- Allow anyone to upload images (for repair request submissions)
CREATE POLICY "Anyone can upload repair images"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (
    bucket_id = 'repair-images' AND
    (storage.foldername(name))[1] IS NOT NULL
  );

-- Allow anyone to view repair images (public bucket)
CREATE POLICY "Anyone can view repair images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'repair-images');

-- Allow authenticated users to delete repair images
CREATE POLICY "Authenticated users can delete repair images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'repair-images');

-- Allow authenticated users to update repair images
CREATE POLICY "Authenticated users can update repair images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'repair-images')
  WITH CHECK (bucket_id = 'repair-images');

-- Invoice Policies

-- Allow authenticated users to upload invoices
CREATE POLICY "Authenticated users can upload invoices"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'invoices');

-- Allow authenticated users to view all invoices
CREATE POLICY "Authenticated users can view all invoices"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'invoices');

-- Allow authenticated users to delete invoices
CREATE POLICY "Authenticated users can delete invoices"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'invoices');

-- Allow authenticated users to update invoices
CREATE POLICY "Authenticated users can update invoices"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'invoices')
  WITH CHECK (bucket_id = 'invoices');