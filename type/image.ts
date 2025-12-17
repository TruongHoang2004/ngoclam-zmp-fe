import { PaginationResponse } from "./pagination";

export interface Image {
  id: number;
  name: string;
  url: string;
  hash: string;
  folder_id: number;
  created_at: string;
  updated_at: string;
}

export interface UploadImageFromURLRequest {
  url: string;
  file_name?: string;
}

export interface UpdateImageFromURLRequest {
  url: string;
  file_name?: string;
}
