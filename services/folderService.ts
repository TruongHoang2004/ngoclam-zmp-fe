import apiClient from './client';
import { Folder, CreateFolderRequest, UpdateFolderRequest } from '@/type/folder';
import { PaginationResponse } from '@/type/pagination';
import { AxiosResponse } from 'axios';

export const folderService = {
    createFolder: async (data: CreateFolderRequest): Promise<void> => {
        await apiClient.post('/folders', data);
    },

    listFolders: async (page: number = 1, size: number = 10): Promise<PaginationResponse<Folder>> => {
        const response: AxiosResponse<any> = await apiClient.get('/folders', {
            params: { page, size }
        });
        return response.data;
    },

    getFolder: async (id: number): Promise<Folder> => {
        const response: AxiosResponse<any> = await apiClient.get(`/folders/${id}`);
        return response.data;
    },

    updateFolder: async (id: number, data: UpdateFolderRequest): Promise<Folder> => {
        const response: AxiosResponse<any> = await apiClient.put(`/folders/${id}`, data);
        return response.data;
    },

    deleteFolder: async (id: number): Promise<void> => {
        await apiClient.delete(`/folders/${id}`);
    }
};
