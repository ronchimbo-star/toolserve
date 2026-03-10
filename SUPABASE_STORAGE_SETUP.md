# Supabase Storage Setup for Photo Uploads

This guide will help you set up the Supabase Storage bucket required for repair request photo uploads.

## Prerequisites

- Access to your Supabase project dashboard
- Admin permissions on the project

## Setup Steps

### 1. Create Storage Bucket

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your ToolServe project
3. Navigate to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Configure the bucket:
   - **Name**: `repair-request-photos`
   - **Public bucket**: ✅ **Check this box** (photos need to be viewable by admin)
   - **File size limit**: 2MB (optional, can be configured)
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`

6. Click **"Create bucket"**

### 2. Configure Bucket Policies

The bucket needs to allow:
- **Anyone** to upload photos (for repair request form)
- **Authenticated users** (admins) to view and delete photos

#### Set Up Policies:

1. Click on the **`repair-request-photos`** bucket you just created
2. Go to the **"Policies"** tab
3. Click **"New policy"**

#### Policy 1: Allow Public Uploads

```sql
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'repair-request-photos');
```

**Or using the UI:**
- **Policy name**: Allow public uploads
- **Allowed operation**: INSERT
- **Target roles**: public
- **WITH CHECK expression**: `bucket_id = 'repair-request-photos'`

#### Policy 2: Allow Public to Read

```sql
CREATE POLICY "Allow public to read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'repair-request-photos');
```

**Or using the UI:**
- **Policy name**: Allow public to read
- **Allowed operation**: SELECT
- **Target roles**: public
- **USING expression**: `bucket_id = 'repair-request-photos'`

#### Policy 3: Allow Authenticated Users to Delete

```sql
CREATE POLICY "Allow authenticated users to delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'repair-request-photos');
```

**Or using the UI:**
- **Policy name**: Allow authenticated users to delete
- **Allowed operation**: DELETE
- **Target roles**: authenticated
- **USING expression**: `bucket_id = 'repair-request-photos'`

### 3. Verify Setup

Test that the storage bucket is working:

1. Go to your ToolServe application
2. Navigate to the Repair Request page
3. Try uploading a test image
4. Verify:
   - ✅ Image uploads successfully
   - ✅ Preview appears in the UI
   - ✅ No console errors

### 4. Check Storage in Dashboard

After uploading a test image:

1. Return to Supabase Dashboard
2. Go to **Storage** > **repair-request-photos**
3. You should see your uploaded image in the `repair-requests/` folder
4. Click on the image to verify it's accessible

## Storage Structure

Photos are organized as:
```
repair-request-photos/
└── repair-requests/
    ├── abc123-1234567890.jpg
    ├── def456-1234567891.png
    └── ...
```

Each photo is named with a random ID + timestamp for uniqueness.

## Important Notes

### Security Considerations

1. **Public Upload**: Anyone can upload to this bucket via the repair request form
   - This is intentional for customer convenience
   - File types are restricted to images only
   - File size is limited to 2MB per image
   - Consider adding rate limiting if abuse becomes an issue

2. **Public Read**: Anyone with the URL can view photos
   - This is necessary for admin dashboard viewing
   - Photos are not listed publicly, only accessible via direct URL
   - URLs contain random identifiers making them hard to guess

3. **Admin Delete**: Only authenticated admin users can delete photos
   - Protects against accidental/malicious deletion
   - Admins can clean up photos after requests are completed

### Storage Limits

Free tier Supabase includes:
- **1GB** of storage
- **2GB** of egress per month

Monitor your usage in **Settings** > **Usage** to ensure you don't exceed limits.

### Optimization Tips

1. **Client-side Compression**: The app already limits uploads to 2MB
2. **Cleanup Policy**: Consider implementing a cleanup job to delete photos from old, completed requests
3. **Monitoring**: Set up alerts for storage usage in Supabase dashboard

## Troubleshooting

### Upload Fails with "Permission Denied"

**Problem**: Storage policies not configured correctly

**Solution**:
1. Check that the bucket is public
2. Verify Policy 1 (Allow public uploads) is active
3. Check browser console for specific error messages

### Images Don't Display After Upload

**Problem**: Public read policy missing

**Solution**:
1. Verify Policy 2 (Allow public to read) is active
2. Check that bucket is marked as public
3. Try accessing the image URL directly in browser

### "Bucket Not Found" Error

**Problem**: Bucket name mismatch

**Solution**:
1. Verify bucket is named exactly `repair-request-photos` (no spaces, all lowercase)
2. Check for typos in the bucket name
3. Refresh the application after creating the bucket

### Storage Quota Exceeded

**Problem**: Free tier limit reached

**Solution**:
1. Upgrade to Supabase Pro plan for more storage
2. Implement a cleanup policy for old photos
3. Compress images more aggressively

## Testing Checklist

Before considering setup complete, verify:

- [ ] Bucket created with name `repair-request-photos`
- [ ] Bucket is marked as public
- [ ] Three policies are active (upload, read, delete)
- [ ] Test upload works from repair request form
- [ ] Uploaded image displays in preview
- [ ] Image URL is valid and accessible
- [ ] Admin dashboard can view uploaded images (upcoming feature)

## Need Help?

If you encounter issues:

1. Check the [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
2. Review the [Storage Policies Guide](https://supabase.com/docs/guides/storage/security/access-control)
3. Check browser console for error messages
4. Verify your Supabase project is active and not paused

---

**Setup Complete!** Your ToolServe application can now accept photo uploads with repair requests. 🎉
