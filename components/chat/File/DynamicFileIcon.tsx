"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DynamicFileIconProps {
    extension: string;
    className?: string;
}

// 1. Cập nhật bảng màu chuẩn bạn cung cấp
const FILE_CONFIG: Record<string, { color: string; label: string }> = {
    // Excel / CSV
    csv: { color: "#43aa55", label: "CSV" },
    xls: { color: "#2f6d3f", label: "XLS" },
    xlsx: { color: "#2f6d3f", label: "XLSX" },

    // Word / Text
    doc: { color: "#2b56b1", label: "DOC" },
    docx: { color: "#2b56b1", label: "DOCX" },
    txt: { color: "#607180", label: "TXT" },
    text: { color: "#607180", label: "TXT" },

    // PDF
    pdf: { color: "#de2429", label: "PDF" },

    // Powerpoint
    ppt: { color: "#c43e1b", label: "PPT" },
    pptx: { color: "#c43e1b", label: "PPTX" },

    // Default
    default: { color: "#607180", label: "FILE" },
};

export const DynamicFileIcon = ({ extension, className }: DynamicFileIconProps) => {
    const config = FILE_CONFIG[extension.toLowerCase()] || FILE_CONFIG.default;

    // Logic kiểm tra độ dài nhãn để chỉnh size chữ
    const isLongLabel = config.label.length > 3;

    return (
        <div className={cn("relative flex items-center justify-center shrink-0", className)}>
            <svg
                viewBox="0 0 24 24"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-sm"
            >
                {/* 1. Main Body */}
                <path
                    d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z"
                    fill={config.color}
                    className="transition-colors duration-300"
                />

                {/* 2. Folded Corner */}
                <path
                    d="M14 2l6 6h-4a2 2 0 01-2-2V2z"
                    fill="#fff"
                    fillOpacity=".5"
                />

                {/* 3. Text Label (Đã fix lỗi tràn) */}
                <text
                    x="50%"
                    y="72%"
                    textAnchor="middle"
                    fill="#fff"
                    // Nếu chữ dài (>3 ký tự) thì giảm size xuống 4.5, ngược lại để 6
                    fontSize={isLongLabel ? "4.5" : "6"}
                    fontWeight="bold"
                    style={{
                        fontFamily: 'var(--font-sans)',
                        // Nếu chữ dài thì giảm khoảng cách chữ (tracking) một chút cho gọn
                        letterSpacing: isLongLabel ? '0' : '0.02em'
                    }}
                >
                    {config.label}
                </text>

                {/* 4. Border Stroke Overlay */}
                <path
                    d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z"
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="0.5"
                />
            </svg>
        </div>
    );
};