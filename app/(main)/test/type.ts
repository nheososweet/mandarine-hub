// ============================================
// API Request/Response Types
// ============================================

export interface UploadFromUrlRequest {
    file_url: string
    table_name: string
    file_id: string
}

export interface UploadFromUrlResponse {
    status: 'success' | 'duplicated' | 'error'
    message: string
    track_id: string
}

export interface DocumentStatus {
    id: string
    content_summary: string
    content_length: number
    status: 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED'
    created_at: string
    updated_at: string
    track_id: string
    chunks_count: number
    error_msg: string | null
    metadata: Record<string, any> | null
    file_path: string | null
}

export interface TrackStatusResponse {
    track_id: string
    documents: DocumentStatus[]
    total_count: number
}

export interface PaginatedDocsRequest {
    status_filter?: string
    page?: number
    page_size?: number
    sort_field?: 'created_at' | 'updated_at' | 'id' | 'file_path'
    sort_direction?: 'asc' | 'desc'
}

export interface PaginationInfo {
    page: number
    page_size: number
    total_count: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
}

export interface StatusCounts {
    PENDING?: number
    PROCESSING?: number
    PROCESSED?: number
    FAILED?: number
    [key: string]: number | undefined
}

export interface PaginatedDocsResponse {
    documents: DocumentStatus[]
    pagination: PaginationInfo
    status_counts: StatusCounts
}
