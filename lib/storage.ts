import { createClient } from '@/lib/supabase/client';

// Storage bucket names
export const STORAGE_BUCKETS = {
  VENDOR_PHOTOS: 'vendor-photos',
  VENDOR_DOCUMENTS: 'vendor-documents',
} as const;

// Maximum file sizes (in bytes)
export const MAX_FILE_SIZES = {
  PHOTO: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
} as const;

// Allowed file types
export const ALLOWED_FILE_TYPES = {
  PHOTOS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  DOCUMENTS: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
} as const;

interface UploadFileOptions {
  bucket: string;
  file: File;
  path?: string;
  userId: string;
}

interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile({
  bucket,
  file,
  path,
  userId,
}: UploadFileOptions): Promise<UploadResult> {
  try {
    const supabase = createClient();

    // Generate unique file path
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${timestamp}.${fileExt}`;
    const filePath = path || fileName;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { success: false, error: error.message || 'Upload failed' };
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Delete error:', error);
    return { success: false, error: error.message || 'Delete failed' };
  }
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  allowedTypes: readonly string[],
  maxSize: number
): { valid: boolean; error?: string } {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  return { valid: true };
}

/**
 * Extract file path from Supabase Storage URL
 */
export function getFilePathFromUrl(url: string, bucket: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    const bucketIndex = pathSegments.indexOf(bucket);

    if (bucketIndex === -1) return null;

    return pathSegments.slice(bucketIndex + 1).join('/');
  } catch {
    return null;
  }
}
