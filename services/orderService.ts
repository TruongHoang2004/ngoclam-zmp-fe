import apiClient from './client';
import { Order, CreateOrderRequest, CreateOrderResponse } from '@/type/order';
import { PaginationResponse } from '@/type/pagination';
import { AxiosResponse } from 'axios';

export const orderService = {
    createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
        const response: AxiosResponse<any> = await apiClient.post('/orders', data);
        return response.data;
    },

    listOrders: async (page: number = 1, size: number = 20): Promise<PaginationResponse<Order>> => {
        const response: AxiosResponse<any> = await apiClient.get('/orders', {
            params: { page, size }
        });
        return response.data; // Pagination response is direct
    },

    getOrder: async (id: number): Promise<Order> => {
        const response: AxiosResponse<any> = await apiClient.get(`/orders/${id}`);
        return response.data;
    }
};
