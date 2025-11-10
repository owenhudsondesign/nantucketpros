"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface FileUploadProps {
  label: string;
  accept: string;
  maxSize: number;
  maxFiles?: number;
  currentFiles?: string[];
  onUpload: (file: File) => Promise<void>;
  onDelete?: (url: string) => Promise<void>;
  disabled?: boolean;
  preview?: boolean;
  helperText?: string;
}

export function FileUpload({
  label,
  accept,
  maxSize,
  maxFiles = 5,
  currentFiles = [],
  onUpload,
  onDelete,
  disabled = false,
  preview = false,
  helperText,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onUpload(file);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (url: string) => {
    if (!onDelete || !confirm('Are you sure you want to delete this file?')) return;

    setDeleting(url);
    try {
      await onDelete(url);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(null);
    }
  };

  const canUploadMore = currentFiles.length < maxFiles;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label>{label}</Label>
          {helperText && (
            <p className="text-xs text-sand-500 mt-1">{helperText}</p>
          )}
        </div>
        {canUploadMore && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Current Files */}
      {currentFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {currentFiles.map((url) => (
            <Card key={url} className="relative group">
              {preview && url.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                <div className="aspect-video relative rounded-lg overflow-hidden bg-sand-100">
                  <img
                    src={url}
                    alt="Upload"
                    className="object-cover w-full h-full"
                  />
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => handleDelete(url)}
                      disabled={deleting === url}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-sand-600 truncate">
                        {url.split('/').pop()}
                      </p>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-ocean-600 hover:underline"
                      >
                        View
                      </a>
                    </div>
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(url)}
                        disabled={deleting === url}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50 ml-2"
                      >
                        <span className="text-lg">×</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {!canUploadMore && (
        <p className="text-xs text-sand-500">
          Maximum {maxFiles} files allowed. Delete a file to upload another.
        </p>
      )}
    </div>
  );
}
