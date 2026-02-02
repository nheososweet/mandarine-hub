import type {
    UploadFromUrlRequest,
    UploadFromUrlResponse,
    TrackStatusResponse,
    PaginatedDocsRequest,
    PaginatedDocsResponse,
} from './type'

// Cấu hình API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_LIGHTRAG_API_URL || 'http://192.168.0.26:9621'
const API_TOKEN = process.env.NEXT_PUBLIC_LIGHTRAG_API_TOKEN || ''

// Helper function để gọi API
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` }),
        ...options?.headers,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
}

/**
 * Upload document từ URL
 */
export async function uploadFromUrl(
    request: UploadFromUrlRequest
): Promise<UploadFromUrlResponse> {
    return fetchAPI<UploadFromUrlResponse>('/documents/upload_from_url', {
        method: 'POST',
        body: JSON.stringify(request),
    })
}

/**
 * Lấy status của document theo track_id
 */
export async function getTrackStatus(trackId: string): Promise<TrackStatusResponse> {
    return fetchAPI<TrackStatusResponse>(`/documents/track_status/${trackId}`)
}

/**
 * Lấy danh sách documents với phân trang
 */
export async function getDocumentsPaginated(
    request: PaginatedDocsRequest
): Promise<PaginatedDocsResponse> {
    return fetchAPI<PaginatedDocsResponse>('/documents/paginated', {
        method: 'POST',
        body: JSON.stringify(request),
    })
}

/**
 * Poll status cho đến khi hoàn thành (helper function)
 */
export async function waitForEmbeddingCompletion(
    trackId: string,
    options: {
        maxWaitTime?: number // seconds
        pollInterval?: number // seconds
        onProgress?: (doc: any) => void
    } = {}
): Promise<{
    success: boolean
    message: string
    document?: any
    timeout?: boolean
}> {
    const { maxWaitTime = 600, pollInterval = 3, onProgress } = options
    const startTime = Date.now()

    while (Date.now() - startTime < maxWaitTime * 1000) {
        const result = await getTrackStatus(trackId)

        if (result.total_count === 0) {
            // Document chưa được queue
            await sleep(pollInterval * 1000)
            continue
        }

        const doc = result.documents[0]
        onProgress?.(doc)

        if (doc.status === 'PROCESSED') {
            return {
                success: true,
                message: 'Embedding completed successfully',
                document: doc,
            }
        }

        if (doc.status === 'FAILED') {
            return {
                success: false,
                message: 'Embedding failed',
                document: doc,
            }
        }

        // Still processing
        await sleep(pollInterval * 1000)
    }

    return {
        success: false,
        message: 'Timeout waiting for embedding completion',
        timeout: true,
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}
