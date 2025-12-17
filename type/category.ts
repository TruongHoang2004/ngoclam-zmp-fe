import { Image } from './image';

export interface Category {
    id: number;
    name: string;
    slug: string;
    image?: Image;
    created_at: string;
    updated_at: string;
}

export interface CreateCategoryRequest {
    name: string;
    slug: string;
    image_id?: number;
}

export interface UpdateCategoryRequest {
    id?: number;
    name?: string;
    slug?: string;
    image_id?: number;
}
