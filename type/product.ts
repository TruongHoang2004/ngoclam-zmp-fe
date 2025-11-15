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
}

export interface PaginationResponse {
    data: Product[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
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