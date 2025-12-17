export interface CustomerInfoRequest {
    name: string;
    phone: string;
    address: string;
}

export interface OrderItemRequest {
    product_id: number;
    quantity: number;
}

export interface PaymentRequest {
    method: string;
}

export interface CreateOrderRequest {
    customer_info: CustomerInfoRequest;
    items: OrderItemRequest[];
    payment: PaymentRequest;
}

export interface Order {
    id: number;
    total_amount: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface ZaloOrderParams {
    amount: number;
    desc: string;
    item: string;
    extradata: string;
    method: string;
    mac: string;
}

export interface CreateOrderResponse {
    // Defines the fields from model.Order that are relevant, plus Zalo params
    // Since model.Order usage in response might be complex, we approximate based on likely usage
    id: number;
    total_amount: number;
    status: string;

    zalo_params?: ZaloOrderParams;
    mac?: string;
}
