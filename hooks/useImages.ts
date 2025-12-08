import { useState, useEffect, useCallback } from 'react';
import { imageService } from '@/services/imageService';
import type { Image, UploadImageFromURLRequest, UpdateImageFromURLRequest } from '@/type/image';

interface UseImagesReturn {
  images: Image[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
  fetchImages: (page?: number) => Promise<void>;
  uploadImage: (file: File) => Promise<boolean>;
  uploadImageFromURL: (data: UploadImageFromURLRequest) => Promise<boolean>;
  updateImage: (id: number, file: File) => Promise<boolean>;
  updateImageFromURL: (id: number, data: UpdateImageFromURLRequest) => Promise<boolean>;
  deleteImage: (id: number) => Promise<boolean>;
  setCurrentPage: (page: number) => void;
}

export const useImages = (initialPage: number = 1, pageSize: number = 20): UseImagesReturn => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchImages = useCallback(
    async (page: number = currentPage) => {
      setLoading(true);
      try {
        const data = await imageService.getImages(page, pageSize);
        setImages(data.data || []);
        setTotal(Number(data.total) || 0);
        setTotalPages(data.total_pages || 1);
        if (page !== currentPage) {
          setCurrentPage(data.page || page);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize]
  );

  const uploadImage = useCallback(
    async (file: File): Promise<boolean> => {
      try {
        await imageService.uploadImage(file);
        await fetchImages(currentPage);
        return true;
      } catch (error) {
        console.error('Error uploading image:', error);
        return false;
      }
    },
    [currentPage, fetchImages]
  );

  const uploadImageFromURL = useCallback(
    async (data: UploadImageFromURLRequest): Promise<boolean> => {
      try {
        await imageService.uploadImageFromURL(data);
        await fetchImages(currentPage);
        return true;
      } catch (error) {
        console.error('Error uploading image from URL:', error);
        return false;
      }
    },
    [currentPage, fetchImages]
  );

  const updateImage = useCallback(
    async (id: number, file: File): Promise<boolean> => {
      try {
        await imageService.updateImage(id, file);
        await fetchImages(currentPage);
        return true;
      } catch (error) {
        console.error('Error updating image:', error);
        return false;
      }
    },
    [currentPage, fetchImages]
  );

  const updateImageFromURL = useCallback(
    async (id: number, data: UpdateImageFromURLRequest): Promise<boolean> => {
      try {
        await imageService.updateImageFromURL(id, data);
        await fetchImages(currentPage);
        return true;
      } catch (error) {
        console.error('Error updating image from URL:', error);
        return false;
      }
    },
    [currentPage, fetchImages]
  );

  const deleteImage = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await imageService.deleteImage(id);
        await fetchImages(currentPage);
        return true;
      } catch (error) {
        console.error('Error deleting image:', error);
        return false;
      }
    },
    [currentPage, fetchImages]
  );

  // Fetch images when currentPage or pageSize changes
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await imageService.getImages(currentPage, pageSize);
        setImages(data.data || []);
        setTotal(Number(data.total) || 0);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    console.log(images);
  }, [currentPage, pageSize]);

  return {
    images,
    loading,
    currentPage,
    totalPages,
    total,
    pageSize,
    fetchImages,
    uploadImage,
    uploadImageFromURL,
    updateImage,
    updateImageFromURL,
    deleteImage,
    setCurrentPage,
  };
};

