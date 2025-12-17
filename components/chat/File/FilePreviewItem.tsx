import { Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { Attachment } from "@/providers/chat-input-provider";
import { FileIcon } from "./FileIcon";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { formatFileSize } from "@/utils/file";

interface FilePreviewItemProps {
    attachment: Attachment;
    onRemove: (id: string) => void;
}

export const FilePreviewItem = ({ attachment, onRemove }: FilePreviewItemProps) => {
    const { file, status, id, previewUrl } = attachment;

    return (
        <div className="group/file relative flex w-48 shrink-0 items-center gap-3 rounded-xl border border-border bg-card/50 p-2 pr-8 transition-all hover:bg-card">
            {/* Icon hoặc Ảnh Preview */}
            <FileIcon file={file} previewUrl={previewUrl} />

            {/* Thông tin file */}
            <div className="flex min-w-0 flex-1 flex-col justify-center">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="truncate text-xs font-medium text-foreground cursor-default">
                                {file.name}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{file.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    {/* Trạng thái upload */}
                    {status === "uploading" && (
                        <span className="flex items-center gap-1 text-blue-500">
                            <Loader2 className="h-3 w-3 animate-spin" />
                        </span>
                    )}
                    {status === "success" && (
                        <span className="flex items-center gap-1 text-green-500">
                            <CheckCircle2 className="h-3 w-3" />
                        </span>
                    )}
                    {status === "error" && (
                        <span className="text-red-500">Error</span>
                    )}
                </div>
            </div>

            {/* Nút xóa (Icon thùng rác đỏ) */}
            <Button
                onClick={() => onRemove(id)}
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer absolute right-1 top-1 h-6 w-6 rounded-full text-muted-foreground hover:bg-red-100 hover:text-red-500 opacity-0 group-hover/file:opacity-100 transition-opacity"
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </div>
    );
};