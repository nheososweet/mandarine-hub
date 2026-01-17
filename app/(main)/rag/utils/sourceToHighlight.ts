/**
 * Convert Backend Source format to IHighlight format for react-pdf-highlighter
 */

import { IHighlight } from "@/plugins/pdf-highlighter";


export interface SourceData {
    content: {
        text: string;
    };
    position: {
        boundingRect: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            width: number;
            height: number;
            pageNumber: number;
        };
        rects: Array<{
            x1: number;
            y1: number;
            x2: number;
            y2: number;
            width: number;
            height: number;
            pageNumber: number;
        }>;
        pageNumber: number;
    } | null;
    comment: {
        text: string;
        emoji: string;
    };
    id: string;
    source: string;
    page: number;
}

/**
 * Convert array of SourceData to IHighlight format
 */
export function sourcesToHighlights(sources: SourceData[]): IHighlight[] {
    return sources
        .filter((source) => source.position !== null) // Only include sources with valid positions
        .map((source) => ({
            content: {
                text: source.content.text,
            },
            position: {
                boundingRect: source.position!.boundingRect,
                rects: source.position!.rects,
                pageNumber: source.position!.pageNumber,
            },
            comment: source.comment,
            id: source.id,
        }));
}

/**
 * Group sources by filename
 */
export function groupSourcesByFile(sources: SourceData[]): Record<string, IHighlight[]> {
    const grouped: Record<string, SourceData[]> = {};

    sources.forEach((source) => {
        if (!grouped[source.source]) {
            grouped[source.source] = [];
        }
        grouped[source.source].push(source);
    });

    // Convert each group to highlights
    const result: Record<string, IHighlight[]> = {};
    Object.keys(grouped).forEach((filename) => {
        result[filename] = sourcesToHighlights(grouped[filename]);
    });

    return result;
}
