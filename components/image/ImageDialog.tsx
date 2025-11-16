"use client";

import React, { useState, useEffect } from 'react';
import { Upload, Link, X, Image as ImageIcon } from 'lucide-react';
import type { Image, UploadImageFromURLRequest, UpdateImageFromURLRequest } from '@/type/image';

// UI Components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  image?: Image | null;
  onSubmitFile: (file: File) => Promise<boolean>;
  onSubmitURL: (data: UploadImageFromURLRequest | UpdateImageFromURLRequest) => Promise<boolean>;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  open,
  onOpenChange,
  mode,
  image,
  onSubmitFile,
  onSubmitURL,
}) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [urlData, setUrlData] = useState<{ url: string; file_name?: string }>({
    url: '',
    file_name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && image) {
      setUrlData({
        url: image.url,
        file_name: '', // file_name is optional and not returned in response
      });
      setPreviewUrl(image.url);
      setUploadMethod('url');
      setImageLoadError(false);
    } else {
      resetForm();
    }
  }, [mode, image, open]);

  useEffect(() => {
    setImageLoadError(false);
  }, [urlData.url]);

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUrlData({ url: '', file_name: '' });
    setUploadMethod('file');
    setImageLoadError(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let success = false;

      if (uploadMethod === 'file') {
        if (!selectedFile) {
          toast.error('Please select an image file');
          setIsSubmitting(false);
          return;
        }
        success = await onSubmitFile(selectedFile);
      } else {
        if (!urlData.url) {
          toast.error('Please enter an image URL');
          setIsSubmitting(false);
          return;
        }
        const data = mode === 'edit'
          ? { url: urlData.url, file_name: urlData.file_name }
          : { url: urlData.url, file_name: urlData.file_name };
        success = await onSubmitURL(data);
      }

      if (success) {
        toast.success(`Image ${mode === 'create' ? 'uploaded' : 'updated'} successfully`);
        onOpenChange(false);
        resetForm();
      } else {
        toast.error(`Failed to ${mode === 'create' ? 'upload' : 'update'} image`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Upload Image' : 'Update Image'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 mx-4">
          {/* Upload Method Selection */}
          {mode === 'create' && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant={uploadMethod === 'file' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('file')}
                className="flex-1"
              >
                <Upload size={16} className="mr-2" />
                Upload File
              </Button>
              <Button
                type="button"
                variant={uploadMethod === 'url' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('url')}
                className="flex-1"
              >
                <Link size={16} className="mr-2" />
                From URL
              </Button>
            </div>
          )}

          {/* File Upload */}
          {uploadMethod === 'file' && (
            <div className="space-y-2">
              <Label htmlFor="file">
                Select Image File *
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
              {previewUrl && (
                <Card className="p-4">
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="relative w-full h-64 border rounded-md overflow-hidden bg-muted">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground">
                        File: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* URL Upload */}
          {uploadMethod === 'url' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">
                  Image URL *
                </Label>
                <Input
                  id="url"
                  type="url"
                  value={urlData.url}
                  onChange={(e) => setUrlData({ ...urlData, url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file_name">
                  File Name (Optional)
                </Label>
                <Input
                  id="file_name"
                  type="text"
                  value={urlData.file_name}
                  onChange={(e) => setUrlData({ ...urlData, file_name: e.target.value })}
                  placeholder="custom-image-name.jpg"
                />
              </div>

              {urlData.url && (
                <Card className="p-4">
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="relative w-full h-64 border rounded-md overflow-hidden bg-muted">
                      {!imageLoadError ? (
                        <img
                          src={urlData.url}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={() => setImageLoadError(true)}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <p>Unable to load preview</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : mode === 'create' ? 'Upload' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;

