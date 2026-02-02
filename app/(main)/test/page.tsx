'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UploadForm } from './UploadForm'
import { StatusTracker } from './StatusTracker'
import { DocumentsTable } from './DocumentsTable'

export default function TestEmbeddingPage() {
    const [activeTrackId, setActiveTrackId] = useState<string | null>(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const handleUploadSuccess = (trackId: string) => {
        setActiveTrackId(trackId)
        setRefreshTrigger(prev => prev + 1)
    }

    const handleEmbeddingComplete = () => {
        // Refresh documents table when embedding completes
        setRefreshTrigger(prev => prev + 1)
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Test Embedding API</h1>
                <p className="text-muted-foreground">
                    Upload documents từ URL và theo dõi quá trình embedding real-time
                </p>
            </div>

            <Tabs defaultValue="upload" className="space-y-4">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="tracking">Tracking</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload từ URL</CardTitle>
                            <CardDescription>
                                Nhập thông tin document để upload và xử lý embedding
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UploadForm onSuccess={handleUploadSuccess} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tracking" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Theo dõi Status</CardTitle>
                            <CardDescription>
                                Monitor quá trình embedding real-time bằng track_id
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StatusTracker
                                initialTrackId={activeTrackId}
                                onComplete={handleEmbeddingComplete}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách Documents</CardTitle>
                            <CardDescription>
                                Xem tất cả documents đã upload với phân trang
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DocumentsTable refreshTrigger={refreshTrigger} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
