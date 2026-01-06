"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentPreviewSheet({
  open,
  onOpenChange,
}: DocumentPreviewSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[95%] sm:max-w-[1400px] p-0 flex flex-col bg-zinc-100 dark:bg-zinc-900 border-l">
        {/* Header */}
        <SheetHeader className="p-4 border-b bg-white dark:bg-zinc-950 shrink-0">
          <SheetTitle className="flex items-center gap-2 text-base">
            Title
          </SheetTitle>
          <SheetDescription>
            Xem tài liệu với các vùng highlight từ nguồn tham chiếu
          </SheetDescription>
        </SheetHeader>
        {/* Content */}
        Content
      </SheetContent>
    </Sheet>
  );
}

// Re-export HighlightArea type for convenience
