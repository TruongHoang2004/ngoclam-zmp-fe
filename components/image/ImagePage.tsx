"use client";

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useImages } from '@/hooks/useImages';
import type { Image, UploadImageFromURLRequest, UpdateImageFromURLRequest } from '@/type/image';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageDialog from '@/components/image/ImageDialog';
import { toast } from 'sonner';

const ImageManager: React.FC = () => {
  const router = useRouter();
  const {
    images,
    loading,
    total,
    totalPages,
    uploadImage,
    uploadImageFromURL,
    updateImage,
    updateImageFromURL,
    deleteImage,
    setCurrentPage,
    currentPage,
    pageSize,
  } = useImages(1, 20);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  // Modal handlers
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedImage(null);
    setShowModal(true);
  };

  const openEditModal = (image: Image) => {
    setModalMode('edit');
    setSelectedImage(image);
    setShowModal(true);
  };

  // Form handlers
  const handleUploadImage = async (file: File) => {
    return await uploadImage(file);
  };

  const handleUploadImageFromURL = async (data: UploadImageFromURLRequest | UpdateImageFromURLRequest) => {
    if (modalMode === 'create') {
      return await uploadImageFromURL(data as UploadImageFromURLRequest);
    } else {
      return await updateImageFromURL(selectedImage!.id, data as UpdateImageFromURLRequest);
    }
  };

  const handleUpdateImage = async (file: File) => {
    if (!selectedImage) return false;
    return await updateImage(selectedImage.id, file);
  };

  const handleDeleteImage = async (id: number) => {

    const toastId = toast.loading('Deleting image...');

    const success = await deleteImage(id);
    if (success) {
      toast.dismiss(toastId);
      toast.success('Image deleted successfully');
    } else {
      toast.dismiss(toastId);
      toast.error('Failed to delete image');
    }
  };

  const handleImageClick = (image: Image) => {
    router.push(`/images/${image.id}`);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Image Management</h1>
            <p className="text-muted-foreground mt-1">Manage your uploaded images</p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus size={20} />
            Upload Image
          </Button>
        </div>

        {/* Stats */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Images</CardTitle>
                <p className="text-3xl font-bold text-foreground mt-2">{total}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Images Grid */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading images...</p>
                </div>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-muted-foreground mb-2">No images found</p>
                <p className="text-sm text-muted-foreground mb-4">Get started by uploading your first image</p>
                <Button onClick={openCreateModal}>
                  <Plus size={16} className="mr-2" />
                  Upload Image
                </Button>
              </div>
            ) : (
              <>
                {/* Images Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(Array.isArray(images) ? images : []).map((image) => (
                    <Card
                      key={image.id}
                      className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                      onClick={() => handleImageClick(image)}
                    >
                      <div className="relative aspect-square bg-muted">
                        <img
                          src={image.url}
                          alt={`Image ${image.id}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(image);
                              }}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(image.id);
                              }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="font-medium text-sm truncate" title={`Image ${image.id}`}>
                          Image #{image.id}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 truncate" title={image.url}>
                          {image.hash || 'No hash'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={18} className="mr-2" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                      <ChevronRight size={18} className="ml-2" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Image Dialog */}
      <ImageDialog
        open={showModal}
        onOpenChange={setShowModal}
        mode={modalMode}
        image={selectedImage}
        onSubmitFile={modalMode === 'create' ? handleUploadImage : handleUpdateImage}
        onSubmitURL={handleUploadImageFromURL}
      />
    </div>
  );
};

export default ImageManager;
