// import { FileText, Image as ImageIcon } from "lucide-react";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { getFileExtension } from "@/utils/file";

// interface FileIconProps {
//     file: File;
//     previewUrl?: string;
//     className?: string;
// }

// export const FileIcon = ({ file, previewUrl, className }: FileIconProps) => {
//     const isImage = file.type.startsWith("image/");
//     const extension = getFileExtension(file.name);

//     // Style cho các loại file khác nhau
//     const getFileStyle = (ext: string) => {
//         switch (ext) {
//             case "PDF":
//                 return "bg-red-100 text-red-600 border-red-200";
//             case "DOC":
//             case "DOCX":
//                 return "bg-blue-100 text-blue-600 border-blue-200";
//             case "XLS":
//             case "XLSX":
//                 return "bg-green-100 text-green-600 border-green-200";
//             case "ZIP":
//             case "RAR":
//                 return "bg-yellow-100 text-yellow-600 border-yellow-200";
//             default:
//                 return "bg-gray-100 text-gray-600 border-gray-200";
//         }
//     };

//     if (isImage && previewUrl) {
//         return (
//             <div className={cn("relative h-10 w-10 overflow-hidden rounded-lg bg-muted", className)}>
//                 <Image
//                     src={previewUrl}
//                     alt={file.name}
//                     fill
//                     className="object-cover"
//                 />
//             </div>
//         );
//     }

//     return (
//         <div className={cn(
//             "flex h-10 w-10 flex-col items-center justify-center rounded-lg border text-[10px] font-bold",
//             getFileStyle(extension),
//             className
//         )}>
//             <span className="uppercase">{extension.slice(0, 3)}</span>
//         </div>
//     );
// };

// import { FileText } from "lucide-react";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { getFileExtension } from "@/utils/file"; // Giả sử bạn đã có hàm này

// interface FileIconProps {
//     file: File;
//     previewUrl?: string;
//     className?: string;
// }

// // Map extension sang đường dẫn file trong public/
// // Ví dụ: file docx -> hiển thị /docx.svg
// const ICON_MAP: Record<string, string> = {
//     csv: "/csv.svg",
//     doc: "/doc.svg",
//     docx: "/docx.svg",
//     pdf: "/pdf.svg",
//     ppt: "/ppt.svg",
//     pptx: "/pptx.svg",
//     text: "/text.svg", // Hoặc /txt.svg tùy file bạn có
//     txt: "/txt.svg",
//     xls: "/xls.svg",
//     xlsx: "/xlsx.svg",
// };

// export const FileIcon = ({ file, previewUrl, className }: FileIconProps) => {
//     const isImage = file.type.startsWith("image/");
//     // Lấy extension và chuyển về chữ thường để so khớp (VD: PDF -> pdf)
//     const extension = getFileExtension(file.name).toLowerCase();

//     // 1. Xử lý Ảnh (Image Preview)
//     if (isImage && previewUrl) {
//         return (
//             <div className={cn("relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted border border-border", className)}>
//                 <Image
//                     src={previewUrl}
//                     alt={file.name}
//                     fill
//                     className="object-cover"
//                 />
//             </div>
//         );
//     }

//     // 2. Xử lý Document Icons (Dùng SVG từ public)
//     if (ICON_MAP[extension]) {
//         return (
//             <div className={cn("relative h-10 w-10 shrink-0", className)}>
//                 <Image
//                     src={ICON_MAP[extension]}
//                     alt={extension}
//                     fill
//                     className="object-contain" // Giữ tỉ lệ icon, không bị méo
//                 />
//             </div>
//         );
//     }

//     // 3. Fallback (Cho các file không có icon riêng như zip, rar, exe...)
//     // Bạn có thể giữ logic màu sắc cũ hoặc dùng icon mặc định
//     return (
//         <div className={cn(
//             "flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border bg-muted text-[10px] font-bold text-muted-foreground",
//             className
//         )}>
//             <FileText className="h-5 w-5 mb-0.5" />
//             <span className="uppercase text-[8px]">{extension.slice(0, 3)}</span>
//         </div>
//     );
// };

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getFileExtension } from "@/utils/file";
import { DynamicFileIcon } from "./DynamicFileIcon"; // Import component vừa tạo

interface FileIconProps {
    file: File;
    previewUrl?: string;
    className?: string;
}

export const FileIcon = ({ file, previewUrl, className }: FileIconProps) => {
    const isImage = file.type.startsWith("image/");
    const extension = getFileExtension(file.name);

    // 1. Xử lý Ảnh (Giữ nguyên)
    if (isImage && previewUrl) {
        return (
            <div className={cn("relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted", className)}>
                <Image
                    src={previewUrl}
                    alt={file.name}
                    fill
                    className="object-cover"
                />
            </div>
        );
    }

    // 2. Xử lý File Icon (Dùng component SVG Inline mới)
    return (
        <DynamicFileIcon
            extension={extension}
            className={cn("h-10 w-10", className)}
        />
    );
};