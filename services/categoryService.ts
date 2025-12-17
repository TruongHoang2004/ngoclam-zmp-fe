import apiClient from './client';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/type/category';
import { PaginationResponse } from '@/type/pagination';
import { Product } from '@/type/product';
import { AxiosResponse } from 'axios';

export const categoryService = {
    createCategory: async (data: CreateCategoryRequest): Promise<void> => {
        await apiClient.post('/categories', data);
    },

    getCategory: async (id: number): Promise<Category> => {
        const response: AxiosResponse<any> = await apiClient.get(`/categories/${id}`);
        return response.data.data;
    },

    listCategories: async (): Promise<Category[]> => {
        const response: AxiosResponse<any> = await apiClient.get('/categories');
        return response.data.data;
    },

    updateCategory: async (id: number, data: UpdateCategoryRequest): Promise<Category> => {
        const response: AxiosResponse<any> = await apiClient.put(`/categories/${id}`, data);
        return response.data.data;
    },

    deleteCategory: async (id: number): Promise<void> => {
        await apiClient.delete(`/categories/${id}`);
    },

    getProductsByCategory: async (id: number, page: number = 1, size: number = 10): Promise<PaginationResponse<Product>> => {
        const response: AxiosResponse<any> = await apiClient.get(`/categories/${id}/products`, {
            params: { page, size }
        });
        return response.data.data;
    }
};
