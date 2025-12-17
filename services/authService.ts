import apiClient from './client';
import { DecodePhoneNumberRequest, DecodePhoneNumberResponse } from '@/type/auth';
import { AxiosResponse } from 'axios';

export const authService = {
    /**
     * Decode phone number from Zalo token
     */
    decodePhoneNumber: async (data: DecodePhoneNumberRequest): Promise<DecodePhoneNumberResponse> => {
        const response: AxiosResponse<any> = await apiClient.post('/auth/decode-phone', data);
        return response.data.data;
    },
};
