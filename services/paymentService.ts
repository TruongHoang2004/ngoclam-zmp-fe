import apiClient from './client';
import { NotifyCallbackRequest, OrderCallbackRequest, NotifyCallbackResponse, OrderCallbackResponse } from '@/type/payment';
import { AxiosResponse } from 'axios';

export const paymentService = {
    notifyCallback: async (data: NotifyCallbackRequest): Promise<NotifyCallbackResponse> => {
        const response: AxiosResponse<any> = await apiClient.post('/payment/notify-callback', data);
        return response.data;
    },

    orderCallback: async (data: OrderCallbackRequest): Promise<OrderCallbackResponse> => {
        const response: AxiosResponse<any> = await apiClient.post('/payment/order-callback', data);
        return response.data;
    }
};
