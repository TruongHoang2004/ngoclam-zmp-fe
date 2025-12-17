export interface NotifyCallbackData {
    orderId: string;
    method: string;
    appId: string;
}

export interface NotifyCallbackRequest {
    data: NotifyCallbackData;
    mac: string;
}

export interface NotifyCallbackResponse {
    return_code: number;
    return_message: string;
}

export interface OrderCallbackRequest {
    appId: string;
    orderId: string; // Zalo's Order ID
    method: string;
    mac: string;
    amount: number;
    description: string;
    message: string;
    resultCode: number;
    transId: string;
    extradata: string;
}

export interface OrderCallbackResponse {
    return_code: number;
    return_message: string;
}
