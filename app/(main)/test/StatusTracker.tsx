'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, CheckCircle2, XCircle, Clock, Search } from 'lucide-react'
import { getTrackStatus } from './api'
import { DocumentStatus } from './type'

interface StatusTrackerProps {
    initialTrackId?: string | null
    onComplete?: () => void
}

export function StatusTracker({ initialTrackId, onComplete }: StatusTrackerProps) {
    const [trackId, setTrackId] = useState(initialTrackId || '')
    const [isTracking, setIsTracking] = useState(false)
    const [document, setDocument] = useState<DocumentStatus | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [elapsedTime, setElapsedTime] = useState(0)

    const startTracking = useCallback(async (id: string) => {
        if (!id.trim()) return

        setIsTracking(true)
        setError(null)
        setElapsedTime(0)
        const startTime = Date.now()

        const poll = async () => {
            try {
                const result = await getTrackStatus(id)

                if (result.total_count === 0) {
                    // Document chưa được queue
                    setDocument(null)
                    return true // Continue polling
                }

                const doc = result.documents[0]
                setDocument(doc)
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000))

                if (doc.status === 'PROCESSED') {
                    setIsTracking(false)
                    onComplete?.()
                    return false // Stop polling
                }

                if (doc.status === 'FAILED') {
                    setIsTracking(false)
                    setError(doc.error_msg || 'Processing failed')
                    return false // Stop polling
                }

                return true // Continue polling
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
                setIsTracking(false)
                return false // Stop polling
            }
        }

        // Initial poll
        const shouldContinue = await poll()

        if (shouldContinue) {
            // Continue polling every 3 seconds
            const intervalId = setInterval(async () => {
                const cont = await poll()
                if (!cont) {
                    clearInterval(intervalId)
                }
            }, 3000)

            // Cleanup after 10 minutes
            setTimeout(() => {
                clearInterval(intervalId)
                setIsTracking(false)
                setError('Timeout: Quá 10 phút không hoàn thành')
            }, 600000)
        }
    }, [onComplete])

    useEffect(() => {
        if (initialTrackId) {
            setTrackId(initialTrackId)
            startTracking(initialTrackId)
        }
    }, [initialTrackId, startTracking])

    const handleTrack = () => {
        startTracking(trackId)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PROCESSED':
                return <Badge className="bg-green-500"><CheckCircle2 className="mr-1 h-3 w-3" />Completed</Badge>
            case 'PROCESSING':
                return <Badge className="bg-blue-500"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Processing</Badge>
            case 'PENDING':
                return <Badge className="bg-yellow-500"><Clock className="mr-1 h-3 w-3" />Pending</Badge>
            case 'FAILED':
                return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Failed</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <Input
                    placeholder="Nhập track_id để theo dõi..."
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                    disabled={isTracking}
                />
                <Button onClick={handleTrack} disabled={isTracking || !trackId.trim()}>
                    <Search className="mr-2 h-4 w-4" />
                    Track
                </Button>
            </div>

            {isTracking && !document && (
                <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertTitle>Đang tìm document...</AlertTitle>
                    <AlertDescription>
                        Document đang được queue hoặc chưa bắt đầu xử lý
                    </AlertDescription>
                </Alert>
            )}

            {document && (
                <div className="space-y-4 border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Status</p>
                            <div>{getStatusBadge(document.status)}</div>
                        </div>
                        {isTracking && (
                            <div className="text-right text-sm text-muted-foreground">
                                Thời gian: {elapsedTime}s
                            </div>
                        )}
                    </div>

                    {document.status === 'PROCESSING' && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span className="text-muted-foreground">
                                    {document.chunks_count || 0} chunks
                                </span>
                            </div>
                            <Progress value={45} className="animate-pulse" />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">File Path</p>
                            <p className="font-mono truncate">{document.file_path || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Document ID</p>
                            <p className="font-mono truncate">{document.id}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Chunks Count</p>
                            <p className="font-medium">{document.chunks_count || 0}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Content Length</p>
                            <p className="font-medium">{document.content_length || 0} chars</p>
                        </div>
                    </div>

                    {document.status === 'PROCESSED' && (
                        <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-600">Embedding hoàn thành!</AlertTitle>
                            <AlertDescription>
                                Document đã sẵn sàng để query. Tổng thời gian: {elapsedTime}s
                            </AlertDescription>
                        </Alert>
                    )}

                    {document.content_summary && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Content Summary</p>
                            <p className="text-sm border-l-2 pl-3 italic">{document.content_summary}</p>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}
