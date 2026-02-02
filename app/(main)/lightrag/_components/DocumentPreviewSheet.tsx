"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileCode, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import type { ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';

import {
  highlightPlugin,
  HighlightArea,
  MessageIcon,
} from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/print/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/full-screen/lib/styles/index.css';

const ChunkCard = ({
  chunk,
  index,
}: {
  chunk: RetrievedChunk;
  index: number;
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(chunk.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
      {/* Header của Chunk */}
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Số thứ tự Chunk */}
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {index + 1}
          </div>
          {/* Tên file nguồn */}
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{chunk.source}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Số trang */}
          <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-foreground transition-colors border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
            Page {chunk.page}
          </span>

          {/* Nút Copy */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-primary"
            onClick={handleCopy}
            title="Copy text"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Nội dung text */}
      <div className="p-4 text-sm leading-7 text-muted-foreground">
        {/* whitespace-pre-wrap: Giữ nguyên xuống dòng từ data */}
        <p className="whitespace-pre-wrap font-normal">{chunk.text}</p>
        {/* <MarkdownRenderer>{chunk.text}</MarkdownRenderer> */}
        {/* <MessageContent>
          <MessageResponse>{chunk.text}</MessageResponse>
        </MessageContent> */}
      </div>

      {/* Footer nhỏ hiển thị ID (tùy chọn, dùng để debug) */}
      <div className="px-4 pb-2">
        <p className="text-[10px] text-muted-foreground/40 font-mono">
          ID: {chunk.id}
        </p>
      </div>
    </div>
  );
};

interface Note {
  id: number;
  content: string;
  highlightAreas: HighlightArea[];
  quote: string;
}

export interface RetrievedChunk {
  id: string;
  text: string;
  source: string;
  page: number;
}

interface DocumentPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileUrl?: string;
  highlightAreas?: HighlightArea[];
  initialPage?: number;
  documentTitle?: string;
  retrievedChunks?: RetrievedChunk[];
}

export default function DocumentPreviewSheet({
  open,
  onOpenChange,
  fileUrl,
  highlightAreas = [],
  initialPage = 0,
  documentTitle = "Document",
  retrievedChunks = [],
}: DocumentPreviewSheetProps) {
  console.log("Retrieved Chunks:", retrievedChunks);
  // Convert highlightAreas to internal format for rendering
  const highlights = React.useMemo(() => {
    return highlightAreas.map((area, idx) => ({
      id: idx,
      content: `Highlight on page ${area.pageIndex + 1}`,
      highlightAreas: [area],
      quote: "",
    }));
  }, [highlightAreas]);

  const renderHighlights = (props: any) => (
    <div>
      {highlightAreas
        .filter((area) => area.pageIndex === props.pageIndex)
        .map((area, idx) => (
          <div
            key={idx}
            style={Object.assign(
              {},
              {
                background: "yellow",
                opacity: 0.4,
                cursor: "pointer",
              },
              props.getCssProperties(area, props.rotation)
            )}
            title={`Page ${area.pageIndex + 1}`}
          />
        ))}
    </div>
  );

  // Transform toolbar to remove Open File button
  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    // Remove Open File button from toolbar and menu
    Open: () => <></>,
    OpenMenuItem: () => <></>,
  });

  // Initialize plugins
  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  const fullScreenPluginInstance = fullScreenPlugin({
    // Enable keyboard shortcuts (Ctrl+Cmd+F on macOS, F11 on other OS)
    enableShortcuts: true,
  });

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0],  // Giữ tab Thumbnails (trang nhỏ)
      {
        content: sidebarNotes,
        icon: <MessageIcon />,
        title: "Highlights",
      },
    ],
    // Custom toolbar without Open File button
    renderToolbar: (Toolbar) => (
      <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
    ),
  });

  const highlightPluginInstance = highlightPlugin({
    renderHighlights,
  });

  const sidebarNotes = (
    <div style={{ padding: "10px", overflow: "auto", height: "100%" }}>
      <h3 style={{ marginBottom: "10px" }}>
        Highlights ({highlightAreas.length})
      </h3>
      {highlightAreas.length === 0 && <div>No highlights available</div>}
      {highlights.map((note) => (
        <div
          key={note.id}
          style={{
            marginBottom: "15px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => {
            const { jumpToHighlightArea } = highlightPluginInstance;
            jumpToHighlightArea(note.highlightAreas[0]);
            defaultLayoutPluginInstance.activateTab(3);
          }}
        >
          <p style={{ margin: 0, fontSize: "14px" }}>{note.content}</p>
        </div>
      ))}
    </div>
  );

  // const defaultLayoutPluginInstanceWithTabs = defaultLayoutPlugin({
  //   sidebarTabs: (defaultTabs) =>
  //     defaultTabs.concat({
  //       content: sidebarNotes,
  //       icon: <MessageIcon />,
  //       title: "Highlights",
  //     }),
  // });



  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[95%] sm:max-w-7xl p-0 flex flex-col bg-zinc-100 dark:bg-zinc-900 border-l">
        {/* Header */}
        <SheetHeader className="p-4 border-b bg-white dark:bg-zinc-950 shrink-0">
          <SheetTitle className="flex items-center gap-2 text-base">
            {documentTitle}
          </SheetTitle>
          <SheetDescription>
            View document with highlighted source references
          </SheetDescription>
        </SheetHeader>

        {/* Tabs for PDF Viewer and Raw Text */}
        <Tabs
          defaultValue="pdf"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="mx-4 mt-2 w-fit">
            <TabsTrigger value="pdf" className="gap-2">
              <FileText className="w-4 h-4" />
              PDF Viewer
            </TabsTrigger>
            <TabsTrigger value="raw" className="gap-2">
              <FileCode className="w-4 h-4" />
              Raw Retrieved Docs
            </TabsTrigger>
          </TabsList>

          {/* PDF Viewer Tab */}
          <TabsContent value="pdf" className="flex-1 overflow-hidden m-4 mt-2">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              {fileUrl ? (
                <Viewer
                  fileUrl={fileUrl}
                  initialPage={0}
                  plugins={[
                    defaultLayoutPluginInstance,
                    highlightPluginInstance,
                    toolbarPluginInstance,
                    fullScreenPluginInstance,
                  ]}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No file selected</p>
                </div>
              )}
            </Worker>
          </TabsContent>

          {/* Raw Text Tab */}
          <TabsContent
            value="raw"
            className="flex-1 overflow-auto m-4 mt-2 pr-2"
          >
            <div className="space-y-4 pb-8">
              {/* Header nhỏ cho list */}
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Found {retrievedChunks.length} chunks
                </h3>
              </div>

              {retrievedChunks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground animate-in fade-in-50">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <FileCode className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                  <p>No retrieved chunks available</p>
                </div>
              )}

              {/* Render danh sách chunk */}
              <div className="grid gap-4">
                {retrievedChunks.map((chunk, idx) => (
                  <ChunkCard key={chunk.id} chunk={chunk} index={idx} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
