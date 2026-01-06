"use client";

import * as React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- REACT PDF VIEWER IMPORTS ---
// Following official docs: https://react-pdf-viewer.dev/plugins/highlight/
import { Viewer, Worker } from '@react-pdf-viewer/core';
import {
    highlightPlugin,
    Trigger,
    type HighlightArea,
    type RenderHighlightsProps
} from '@react-pdf-viewer/highlight';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import required CSS
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

/**
 * HighlightArea interface from react-pdf-viewer:
 * {
 *   pageIndex: number;  // Zero-based page index
 *   left: number;       // Percentage from left (0-100)
 *   top: number;        // Percentage from top (0-100)
 *   width: number;      // Width as percentage
 *   height: number;     // Height as percentage
 * }
 */

interface DocumentPreviewSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fileUrl: string;                    // URL to PDF file (e.g., /static/document.pdf)
    highlightAreas: HighlightArea[];    // Array of highlight rectangles from backend
    initialPage?: number;               // Zero-based page index to scroll to
}

export function DocumentPreviewSheet({
    open,
    onOpenChange,
    fileUrl,
    highlightAreas,
    initialPage = 0,
}: DocumentPreviewSheetProps) {

    /**
     * Render highlight areas using the highlight plugin.
     * 
     * Key points from documentation:
     * 1. renderHighlights is called for EACH page during render
     * 2. We must filter areas by props.pageIndex
     * 3. Use props.getCssProperties(area, props.rotation) for proper positioning
     * 4. This handles zoom and rotation automatically
     */
    const renderHighlights = React.useCallback(
        (props: RenderHighlightsProps) => (
            <div>
                {highlightAreas
                    // Filter: Only render highlights for current page
                    .filter((area) => area.pageIndex === props.pageIndex)
                    .map((area, idx) => (
                        <div
                            key={`highlight-${props.pageIndex}-${idx}`}
                            className="highlight-area"
                            style={Object.assign(
                                {},
                                {
                                    // Highlight styling
                                    background: 'rgba(255, 235, 59, 0.4)',  // Yellow with transparency
                                    borderRadius: '2px',
                                    // Allow text selection through highlight
                                    pointerEvents: 'none' as const,
                                    // Mix blend for better readability
                                    mixBlendMode: 'multiply' as const,
                                },
                                // CRITICAL: getCssProperties calculates exact position
                                // accounting for zoom level and page rotation
                                props.getCssProperties(area, props.rotation)
                            )}
                        />
                    ))}
            </div>
        ),
        [highlightAreas]
    );

    /**
     * Create highlight plugin instance.
     * 
     * Trigger.None: Disable user text selection highlighting
     * We only want to show backend-provided highlights
     */
    const highlightPluginInstance = React.useMemo(
        () => highlightPlugin({
            renderHighlights,
            trigger: Trigger.None,  // Don't trigger on user selection
        }),
        [renderHighlights]
    );

    /**
     * Default layout plugin for toolbar, sidebar, etc.
     */
    const defaultLayoutPluginInstance = React.useMemo(
        () => defaultLayoutPlugin(),
        []
    );

    /**
     * Jump to highlight area when clicking sidebar items.
     * Exposed by highlightPluginInstance.
     */
    const { jumpToHighlightArea } = highlightPluginInstance;

    // Group highlights by page for sidebar display
    const highlightsByPage = React.useMemo(() => {
        const grouped: Record<number, HighlightArea[]> = {};
        highlightAreas.forEach((area) => {
            if (!grouped[area.pageIndex]) {
                grouped[area.pageIndex] = [];
            }
            grouped[area.pageIndex].push(area);
        });
        return grouped;
    }, [highlightAreas]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                className="w-[95%] sm:max-w-[1400px] p-0 flex flex-col bg-zinc-100 dark:bg-zinc-900 border-l"
            >
                {/* Header */}
                <SheetHeader className="p-4 border-b bg-white dark:bg-zinc-950 shrink-0">
                    <SheetTitle className="flex items-center gap-2 text-base">
                        <FileText className="w-4 h-4 text-red-600" />
                        <span className="truncate">{fileUrl.split('/').pop()}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                            ({highlightAreas.length} highlights)
                        </span>
                    </SheetTitle>
                    <SheetDescription>
                        Xem tài liệu với các vùng highlight từ nguồn tham chiếu
                    </SheetDescription>
                </SheetHeader>

                {/* Main Content: Sidebar + Viewer */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Highlights Sidebar */}
                    <div className="w-48 border-r bg-white dark:bg-zinc-950 overflow-y-auto shrink-0">
                        <div className="p-3 border-b">
                            <h3 className="text-sm font-medium">Highlights</h3>
                        </div>
                        <div className="p-2 space-y-1">
                            {Object.keys(highlightsByPage).length === 0 ? (
                                <p className="text-xs text-muted-foreground p-2">
                                    Không có highlight
                                </p>
                            ) : (
                                Object.entries(highlightsByPage).map(([pageIdx, areas]) => (
                                    <Button
                                        key={pageIdx}
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start text-xs h-8"
                                        onClick={() => {
                                            // Jump to first highlight on this page
                                            if (areas.length > 0) {
                                                jumpToHighlightArea(areas[0]);
                                            }
                                        }}
                                    >
                                        <span className="truncate">
                                            Trang {parseInt(pageIdx) + 1} ({areas.length})
                                        </span>
                                    </Button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* PDF Viewer */}
                    <div className="flex-1 overflow-hidden">
                        {/* 
                         * Worker URL must match pdfjs-dist version.
                         * Check package.json for installed version.
                         */}
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <div style={{ height: '100%', width: '100%' }}>
                                <Viewer
                                    fileUrl={"/noiquy.pdf"}
                                    initialPage={initialPage}
                                    plugins={[
                                        defaultLayoutPluginInstance,
                                        highlightPluginInstance,
                                    ]}
                                    defaultScale={1}
                                />
                            </div>
                        </Worker>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

// Re-export HighlightArea type for convenience
export type { HighlightArea };