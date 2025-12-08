import axios from 'axios';
import type { Image, UploadImageFromURLRequest, UpdateImageFromURLRequest } from '@/type/image';
import apiClient from './client';
import { PaginationResponse } from '@/type/pagination';


export const imageService = {
  /**
   * Get all images with pagination
   * Backend uses page (1-based) and size query params
   * Defaults: page=1, size=20
   */
  getImages: async (page: number = 1, size: number = 20): Promise<PaginationResponse<Image>> => {
    const response = await apiClient.get<PaginationResponse<Image>>('/images', {
      params: { page, size },
    });

    console.log(response.data);

    if (!response.data) {
      throw new Error('No data received from the server');
    }

    return response.data;
  },

  /**
   * Get a single image by ID
   */
  getImageById: async (id: number): Promise<Image> => {
    const response = await apiClient.get<Image>(`/images/${id}`);
    return response.data;
  },

  /**
   * Upload image from file
   */
  uploadImage: async (file: File): Promise<Image> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<Image>('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Upload image from URL
   */
  uploadImageFromURL: async (data: UploadImageFromURLRequest): Promise<Image> => {
    const response = await apiClient.post<Image>('/images/url', data);
    return response.data;
  },

  /**
   * Update image from file
   */
  updateImage: async (id: number, file: File): Promise<Image> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.put<Image>(`/images/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update image from URL
   */
  updateImageFromURL: async (id: number, data: UpdateImageFromURLRequest): Promise<Image> => {
    const response = await apiClient.put<Image>(`/images/${id}/url`, data);
    return response.data;
  },

  /**
   * Delete an image by ID
   */
  deleteImage: async (id: number): Promise<void> => {
    await apiClient.delete(`/images/${id}`);
  },
};

