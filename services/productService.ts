import axios from 'axios';
import type { Product, PaginationResponse, CreateProductForm, UpdateProductRequest } from '@/type/product';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  /**
   * Fetch products with pagination
   */
  getProducts: async (page: number = 1, size: number = 20): Promise<PaginationResponse> => {
    const response = await apiClient.get<PaginationResponse>('/products', {
      params: { page, size },
    });
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
};
