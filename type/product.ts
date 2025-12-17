import { Image } from './image';

export interface ProductVariant {
    id: number;
    product_id: number;
    name: string;
    price: number;
}

export interface ProductImage {
    id: number;
    product_id: number;
    image_id: number;
    variant_id?: number | null;
    order: number;
    is_main: boolean;
    image?: Image;
    variant?: ProductVariant;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    variants?: ProductVariant[];
    images?: ProductImage[];
}

export interface CreateProductVariant {
    name: string;
    price: number;
    stock: number;
}

export interface AttachProductImageRequest {
    image_id: number;
    variant_id?: number;
    order?: number;
    is_main: boolean;
}

export interface CreateProductForm {
    name: string;
    description: string;
    price: number;
    category_id: number;
    variants?: CreateProductVariant[];
    images?: AttachProductImageRequest[];
}

export interface UpdateProductRequest {
    id: number;
    name?: string;
    description?: string;
    price?: number;
}

export interface AddProductVariantRequest {
    product_id: number;
    name: string;
    price: number;
    stock: number;
}

export interface UpdateProductVariantRequest {
    id: number;
    name?: string;
    price?: number;
    stock?: number;
}

export interface UpdateProductImageRequest {
    variant_id?: number;
    order?: number;
    is_main?: boolean;
}