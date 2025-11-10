# Supabase Storage Setup Guide

This guide explains how to set up Supabase Storage buckets for file uploads in NantucketPros.

## Storage Buckets Required

NantucketPros uses two storage buckets:

1. **`vendor-photos`** - For vendor business photos
2. **`vendor-documents`** - For license and insurance documents

## Setup Instructions

### 1. Create Storage Buckets

In your Supabase Dashboard:

1. Go to **Storage** in the left sidebar
2. Click **"New bucket"**
3. Create the first bucket:
   - **Name**: `vendor-photos`
   - **Public bucket**: ✅ **Enabled** (photos should be publicly viewable)
   - Click **Save**
4. Create the second bucket:
   - **Name**: `vendor-documents`
   - **Public bucket**: ❌ **Disabled** (documents should be private)
   - Click **Save**

### 2. Configure Storage Policies

#### For `vendor-photos` (Public Bucket)

The bucket is public, so uploaded images will be accessible via public URLs.

**Upload Policy** - Allow vendors to upload their own photos:

```sql
CREATE POLICY "Vendors can upload own photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vendor-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

**Delete Policy** - Allow vendors to delete their own photos:

```sql
CREATE POLICY "Vendors can delete own photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'vendor-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### For `vendor-documents` (Private Bucket)

Documents are private and should only be accessible to the vendor and admins.

**Upload Policy** - Allow vendors to upload their own documents:

```sql
CREATE POLICY "Vendors can upload own documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vendor-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

**Select Policy** - Allow vendors to view their own documents and admins to view all:

```sql
CREATE POLICY "Vendors can view own documents, admins can view all"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'vendor-documents'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
);
```

**Delete Policy** - Allow vendors to delete their own documents:

```sql
CREATE POLICY "Vendors can delete own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'vendor-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### 3. Apply Policies via Dashboard

1. Go to **Storage** > Click on a bucket > **Policies** tab
2. Click **"New policy"**
3. Choose **"For full customization"**
4. Paste the SQL policy from above
5. Click **Review** and then **Save policy**
6. Repeat for each policy

### 4. Test File Upload

1. Log in as a vendor
2. Go to **Profile** page
3. Upload a business photo
4. Upload a license/insurance document
5. Verify files appear in Storage dashboard
6. Verify photos are publicly accessible
7. Verify documents are NOT publicly accessible

## File Organization

Files are organized by user ID:

```
vendor-photos/
├── {user-id-1}/
│   ├── 1234567890.jpg
│   └── 1234567891.png
└── {user-id-2}/
    └── 1234567892.webp

vendor-documents/
├── {user-id-1}/
│   ├── 1234567893.pdf
│   └── 1234567894.jpg
└── {user-id-2}/
    └── 1234567895.pdf
```

## File Limits

- **Photos**: Max 5 files per vendor, 5MB per file
- **Documents**: Max 3 files per vendor, 10MB per file
- **Allowed photo types**: JPEG, PNG, WebP
- **Allowed document types**: PDF, JPEG, PNG

## Security Notes

1. **RLS is REQUIRED**: Without proper RLS policies, users could access/delete each other's files
2. **Bucket permissions**: Photos are public, documents are private
3. **File paths**: Include user ID in path to enforce ownership
4. **Validation**: File type and size validation happens client-side AND via policies
5. **URLs**: Public photo URLs work immediately; document URLs require authentication

## Troubleshooting

### "403 Forbidden" when uploading
- Check that storage policies are applied correctly
- Verify user is authenticated
- Check that file path includes user ID

### "413 Payload Too Large"
- File exceeds Supabase's upload limit
- Ensure files are under 5MB (photos) or 10MB (documents)

### Photos not loading
- Verify bucket is set to **public**
- Check that URL is formatted correctly
- Ensure RLS policies allow SELECT on public photos

### Documents accessible by wrong users
- Verify `vendor-documents` bucket is **private**
- Check RLS policies are restricting access correctly
- Test with different user accounts

## Production Considerations

1. **CDN**: Consider adding a CDN in front of Supabase Storage for better performance
2. **Image Optimization**: Implement image resizing/compression before upload
3. **Backup**: Set up regular backups of storage buckets
4. **Monitoring**: Track storage usage and set up alerts
5. **Cleanup**: Implement automatic cleanup of deleted vendor files

---

**For more information**: https://supabase.com/docs/guides/storage
