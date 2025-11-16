export interface PaginationResponse<T> {
    data: T[];
    total: number; // int64 from backend
    page: number;
    page_size: number;
    total_pages: number;
}