export interface Folder {
    id: number;
    name: string;
    description: string;
}

export interface CreateFolderRequest {
    name: string;
    description?: string;
    parent_id?: number;
}

export interface UpdateFolderRequest {
    name?: string;
    description?: string;
    parent_id?: number;
}
