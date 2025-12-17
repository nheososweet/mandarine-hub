import { FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getFileExtension } from "@/utils/file";

interface FileIconProps {
    file: File;
    previewUrl?: string;
    className?: string;
}

export const FileIcon = ({ file, previewUrl, className }: FileIconProps) => {
    const isImage = file.type.startsWith("image/");
    const extension = getFileExtension(file.name);

    // Style cho các loại file khác nhau
    const getFileStyle = (ext: string) => {
        switch (ext) {
            case "PDF":
                return "bg-red-100 text-red-600 border-red-200";
            case "DOC":
            case "DOCX":
                return "bg-blue-100 text-blue-600 border-blue-200";
            case "XLS":
            case "XLSX":
                return "bg-green-100 text-green-600 border-green-200";
            case "ZIP":
            case "RAR":
                return "bg-yellow-100 text-yellow-600 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    if (isImage && previewUrl) {
        return (
            <div className={cn("relative h-10 w-10 overflow-hidden rounded-lg bg-muted", className)}>
                <Image
                    src={previewUrl}
                    alt={file.name}
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div className={cn(
            "flex h-10 w-10 flex-col items-center justify-center rounded-lg border text-[10px] font-bold",
            getFileStyle(extension),
            className
        )}>
            <span className="uppercase">{extension.slice(0, 3)}</span>
        </div>
    );
};