"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Loader2, FileText, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- REACT PDF IMPORTS ---
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Mark from "mark.js";

// Cấu hình Worker từ CDN (Để tránh lỗi build trong Next.js)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface DocumentPreviewSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fileName: string;     // Tên file PDF (ví dụ: "so-tay-nhan-vien.pdf")
    highlights: string[]; // List các đoạn text cần highlight
}

export function DocumentPreviewSheet({
    open,
    onOpenChange,
    fileName,
    highlights,
}: DocumentPreviewSheetProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState(false);

    // Ref bao quanh vùng hiển thị PDF
    const pdfWrapperRef = useRef<HTMLDivElement>(null);

    // Reset trang về 1 khi mở file mới
    useEffect(() => {
        if (open) {
            setPageNumber(1);
        }
    }, [open, fileName]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    // --- LOGIC HIGHLIGHT ---
    // Hàm này được gọi tự động sau khi PDF render xong text layer của 1 trang
    const handleTextLayerRendered = useCallback(() => {
        if (!pdfWrapperRef.current || !highlights || highlights.length === 0) return;

        // Tìm lớp text layer mà react-pdf vừa tạo ra
        const textLayer = pdfWrapperRef.current.querySelector(".react-pdf__Page__textContent");
        if (!textLayer) return;

        const instance = new Mark(textLayer as HTMLElement);

        // Clean keywords: Bỏ xuống dòng thừa, chuẩn hóa khoảng trắng
        const keywords = highlights.map(chunk =>
            chunk.replace(/\s+/g, " ").trim()
        );

        console.log("🔍 Đang tìm highlight trên trang", pageNumber, "với keywords:", keywords);

        instance.mark(keywords, {
            element: "span",
            className: "bg-yellow-300/50 text-transparent cursor-pointer mix-blend-multiply", // Style highlight
            accuracy: "partially",
            separateWordSearch: false,
            acrossElements: true, // Cho phép tìm text trải dài qua nhiều dòng
            caseSensitive: false,
            ignorePunctuation: [",", ".", "-", ":", "\"", "'"],
        });
    }, [highlights, pageNumber]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[90%] sm:max-w-[1000px] p-0 flex flex-col bg-zinc-100 dark:bg-zinc-900">

                {/* HEADER */}
                <SheetHeader className="p-4 border-b bg-white dark:bg-zinc-950 shrink-0 flex flex-row items-center justify-between space-y-0">
                    <div className="flex flex-col gap-1">
                        <SheetTitle className="flex items-center gap-2 text-base">
                            <FileText className="w-4 h-4 text-red-600" /> {/* Icon đỏ cho PDF */}
                            <span className="truncate max-w-[400px]">{fileName}</span>
                        </SheetTitle>
                        <SheetDescription className="text-xs">
                            Trang {pageNumber} / {numPages || "--"}
                        </SheetDescription>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={pageNumber <= 1}
                            onClick={() => setPageNumber((prev) => prev - 1)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium w-12 text-center">
                            {pageNumber}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={pageNumber >= numPages}
                            onClick={() => setPageNumber((prev) => prev + 1)}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </SheetHeader>

                {/* PDF VIEWPORT */}
                <div className="flex-1 overflow-auto p-4 flex justify-center bg-zinc-100 dark:bg-zinc-900 relative">

                    {/* Wrapper Ref để Mark.js tìm scope */}
                    <div ref={pdfWrapperRef} className="shadow-lg">
                        <Document
                            // Thay đổi đường dẫn file PDF của bạn ở đây
                            file={`${fileName}`}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <div className="flex flex-col items-center gap-2 mt-20">
                                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Đang tải PDF...</p>
                                </div>
                            }
                            error={
                                <div className="mt-20 text-red-500 text-center px-4">
                                    Không thể tải file PDF. Hãy kiểm tra đường dẫn file: /documents/{fileName}
                                </div>
                            }
                        >
                            <Page
                                pageNumber={pageNumber}
                                width={850} // Kích thước cố định hoặc tính toán theo window width
                                renderTextLayer={true} // Bắt buộc TRUE để Mark.js hoạt động
                                renderAnnotationLayer={false}
                                onRenderSuccess={handleTextLayerRendered} // Trigger highlight sau khi render xong
                                className="bg-white"
                            />
                        </Document>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}