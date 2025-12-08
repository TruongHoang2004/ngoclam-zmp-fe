import axios from 'axios';
import type { Product, CreateProductForm, UpdateProductRequest } from '@/type/product';
import apiClient from './client';
import { PaginationResponse as Pagination } from '@/type/pagination';


export const productService = {
  /**
   * Fetch products with pagination
   */
  getProducts: async (page: number = 1, size: number = 20): Promise<Pagination<Product>> => {
    const response = await apiClient.get<Pagination<Product>>('/products', {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get a single product by ID
   */
  getProductById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Create a new product
   */
  createProduct: async (data: CreateProductForm): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  /**
   * Update an existing product
   */
  updateProduct: async (data: UpdateProductRequest): Promise<Product> => {
    const response = await apiClient.put<Product>('/products', data);
    return response.data;
  },

  /**
   * Delete a product by ID
   */
  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  addProductVariant: async (productId: number, variantId: number): Promise<void> => {
    await apiClient.post(`/products/${productId}/variants/${variantId}`);
  }
};
