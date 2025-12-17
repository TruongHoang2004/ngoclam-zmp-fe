export interface DecodePhoneNumberRequest {
    access_token: string;
    code: string;
}

export interface DecodePhoneNumberResponse {
    phone_number: string;
}
