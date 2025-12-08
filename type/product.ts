// Types
export interface ProductVariant {
    id: number;
    product_id: number;
    name: string;
    price: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    variants?: ProductVariant[];
    images?: {
        id: number;
        product_id: number;
        image_id: number;
        variant_id?: number | null;
        order: number;
        is_main: boolean;
        image: {
            id: number;
            url: string;
            hash: string;
        };
        variant?: ProductVariant;
    }[];
}

export interface CreateProductVariant {
    name: string;
    price: number;
    stock: number;
}

export interface CreateProductForm {
    name: string;
    description: string;
    price: number;
    variants: CreateProductVariant[];
}

export interface UpdateProductRequest {
    id: number;
    name?: string;
    description?: string;
    price?: number;
}