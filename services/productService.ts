import apiClient from './client';
import {
  Product,
  CreateProductForm,
  UpdateProductRequest,
  AddProductVariantRequest,
  UpdateProductVariantRequest,
  ProductImage,
  AttachProductImageRequest,
  UpdateProductImageRequest
} from '@/type/product';
import { PaginationResponse } from '@/type/pagination';
import { AxiosResponse } from 'axios';

export const productService = {
  /**
   * Fetch products with pagination
   */
  getProducts: async (page: number = 1, size: number = 20): Promise<PaginationResponse<Product>> => {
    const response: AxiosResponse<any> = await apiClient.get('/products', {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get a single product by ID
   */
  getProductById: async (id: number): Promise<Product> => {
    const response: AxiosResponse<any> = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Create a new product
   */
  createProduct: async (data: CreateProductForm): Promise<void> => {
    await apiClient.post('/products', data);
  },

  /**
   * Update an existing product
   */
  updateProduct: async (data: UpdateProductRequest): Promise<void> => {
    await apiClient.put('/products', data);
  },

  /**
   * Delete a product by ID
   */
  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  /**
   * Add a variant to a product
   */
  addProductVariant: async (data: AddProductVariantRequest): Promise<void> => {
    await apiClient.post('/products/variants', data);
  },

  /**
   * Update a product variant
   */
  updateProductVariant: async (data: UpdateProductVariantRequest): Promise<void> => {
    await apiClient.put('/products/variants', data);
  },

  /**
   * Delete a product variant
   */
  deleteProductVariant: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/variants/${id}`);
  },

  /**
   * List product images
   */
  listProductImages: async (productId: number): Promise<ProductImage[]> => {
    const response: AxiosResponse<any> = await apiClient.get(`/products/${productId}/images`);
    return response.data;
  },

  /**
   * Attach an image to a product
   */
  attachProductImage: async (productId: number, data: AttachProductImageRequest): Promise<ProductImage> => {
    const response: AxiosResponse<any> = await apiClient.post(`/products/${productId}/images`, data);
    return response.data;
  },

  /**
   * Update a product image
   */
  updateProductImage: async (productId: number, imageId: number, data: UpdateProductImageRequest): Promise<ProductImage> => {
    const response: AxiosResponse<any> = await apiClient.patch(`/products/${productId}/images/${imageId}`, data);
    return response.data;
  },

  /**
   * Delete a product image
   */
  deleteProductImage: async (productId: number, imageId: number): Promise<void> => {
    await apiClient.delete(`/products/${productId}/images/${imageId}`);
  }
};
