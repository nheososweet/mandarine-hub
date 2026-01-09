"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Brain, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Hoặc hàm classnames bạn đang dùng

interface ReasoningBlockProps {
    content: string;
    isStreaming: boolean;
    isDone: boolean; // True nếu đã đóng thẻ </think>
}

export function ReasoningBlock({ content, isStreaming, isDone }: ReasoningBlockProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Tự động mở khi đang stream suy luận, tự đóng khi suy luận xong (tùy chọn)
    // useEffect(() => {
    //   if (isDone) setIsOpen(false);
    // }, [isDone]);

    if (!content && !isStreaming) return null;

    return (
        <div className="mb-4 rounded-lg border border-amber-100/50 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center gap-2 rounded-t-lg px-4 py-2 text-xs font-medium text-amber-600 dark:text-amber-500 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors"
            >
                {isOpen ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                )}
                <Brain className="h-3.5 w-3.5" />
                <span>
                    Thinking Process
                    {!isDone && "..."}
                </span>

                {!isDone && (
                    <Loader2 className="ml-auto h-3 w-3 animate-spin text-amber-600/70" />
                )}
            </button>

            {isOpen && (
                <div className="px-4 pb-3 pt-1">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-muted-foreground/80 leading-relaxed font-mono whitespace-pre-wrap">
                        {content}
                        {!isDone && (
                            <span className="inline-block w-1.5 h-3 ml-1 align-middle bg-amber-500/50 animate-pulse" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}