"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2, Loader2, Download, ExternalLink } from 'lucide-react';
import { imageService } from '@/services/imageService';
import type { Image } from '@/type/image';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ImageDetailPageProps {
  id: number;
}

export const ImageDetailPage: React.FC<ImageDetailPageProps> = ({ id }) => {
  const router = useRouter();
  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Invalid image ID');
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      try {
        setLoading(true);
        const data = await imageService.getImageById(id);
        setImage(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching image:', err);
        setError('Failed to load image');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  const handleDelete = async () => {
    if (!image || !id) return;

    setDeleting(true);
    try {
      await imageService.deleteImage(id);
      router.push('/images');
    } catch (err) {
      console.error('Error deleting image:', err);
      toast.error('Failed to delete image');
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    if (image) {
      // Navigate to image list page - edit functionality is handled via dialog there
      router.push('/images');
    }
  };

  const handleDownload = () => {
    if (image?.url) {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `image-${image.id}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading image...</p>
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-destructive text-lg mb-4">{error || 'Image not found'}</p>
              <Button variant="outline" onClick={() => router.push('/images')}>
                <ArrowLeft size={16} className="mr-2" />
                Back to Images
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/images')}
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Images
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Image #{image.id}</h1>
              <p className="text-muted-foreground mt-1">Hash: {image.hash || 'N/A'}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload}>
                <Download size={16} className="mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={handleEdit}>
                <Pencil size={16} className="mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Image Display */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Image Preview</CardTitle>
            <CardDescription>Full-size image preview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-muted">
              <img
                src={image.url}
                alt={`Image ${image.id}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const errorDiv = document.createElement('div');
                  errorDiv.className = 'flex items-center justify-center h-full text-muted-foreground';
                  errorDiv.innerHTML = '<p>Unable to load image</p>';
                  e.currentTarget.parentElement?.appendChild(errorDiv);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Image Information */}
        <Card>
          <CardHeader>
            <CardTitle>Image Information</CardTitle>
            <CardDescription>Detailed information about the image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID</label>
              <p className="text-lg font-semibold mt-1">{image.id}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Hash</label>
              <p className=" font-semibold mt-1 font-mono text-sm">{image.hash || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">URL</label>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-foreground break-all flex-1">{image.url}</p>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(image.url, '_blank')}
                >
                  <ExternalLink size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

