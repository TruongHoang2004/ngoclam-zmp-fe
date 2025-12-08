import { PaginationResponse } from "./pagination";

export interface Image {
  id: number;
  url: string;
  hash: string;
}

export interface UploadImageFromURLRequest {
  url: string;
  file_name?: string;
}

export interface UpdateImageFromURLRequest {
  url: string;
  file_name?: string;
}


