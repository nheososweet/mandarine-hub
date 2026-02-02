'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { uploadFromUrl } from './api'

const formSchema = z.object({
    fileUrl: z.string().url('URL không hợp lệ'),
    tableName: z.string().min(1, 'Table name không được để trống'),
    fileId: z.string().min(1, 'File ID không được để trống'),
})

type FormValues = z.infer<typeof formSchema>

interface UploadFormProps {
    onSuccess?: (trackId: string) => void
}

export function UploadForm({ onSuccess }: UploadFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: 'https://example.com/sample.pdf',
            tableName: 'test_docs',
            fileId: `doc_${Date.now()}`,
        },
    })

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true)
        try {
            const result = await uploadFromUrl({
                file_url: values.fileUrl,
                table_name: values.tableName,
                file_id: values.fileId,
            })

            if (result.status === 'success') {
                alert(`✅ Upload thành công!\nTrack ID: ${result.track_id}`)
                onSuccess?.(result.track_id)
                setValue('fileId', `doc_${Date.now()}`)
            } else if (result.status === 'duplicated') {
                alert(`⚠️ File đã tồn tại\n${result.message}`)
            } else {
                throw new Error(result.message)
            }
        } catch (err) {
            alert(
                `❌ Upload thất bại\n${err instanceof Error ? err.message : 'Unknown error'
                }`
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* File URL */}
            <div>
                <label className="block text-sm font-medium mb-1">File URL</label>
                <Input
                    placeholder="https://example.com/document.pdf"
                    disabled={isLoading}
                    {...register('fileUrl')}
                />
                {errors.fileUrl && (
                    <p className="text-sm text-red-500 mt-1">
                        {errors.fileUrl.message}
                    </p>
                )}
            </div>

            {/* Table Name */}
            <div>
                <label className="block text-sm font-medium mb-1">Table Name</label>
                <Input
                    placeholder="technical_docs"
                    disabled={isLoading}
                    {...register('tableName')}
                />
                {errors.tableName && (
                    <p className="text-sm text-red-500 mt-1">
                        {errors.tableName.message}
                    </p>
                )}
            </div>

            {/* File ID */}
            <div>
                <label className="block text-sm font-medium mb-1">File ID</label>
                <Input
                    placeholder="doc_123456"
                    disabled={isLoading}
                    {...register('fileId')}
                />
                {errors.fileId && (
                    <p className="text-sm text-red-500 mt-1">
                        {errors.fileId.message}
                    </p>
                )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang upload...
                    </>
                ) : (
                    <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                    </>
                )}
            </Button>
        </form>
    )
}
