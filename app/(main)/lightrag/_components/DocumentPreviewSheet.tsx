"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  FileText,
  FileCode,
  Copy,
  Check,
  ChevronDown,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import type { ToolbarSlot, TransformToolbarSlot } from "@react-pdf-viewer/toolbar";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";

import {
  highlightPlugin,
  HighlightArea,
  MessageIcon,
} from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import "@react-pdf-viewer/print/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";

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
        <p className="whitespace-pre-wrap font-normal">{chunk.text}</p>
      </div>

      {/* Footer nhỏ hiển thị ID */}
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
  url: string;
  page: number;
}

interface Source {
  source: string;
  url: string;
  page: number;
}

interface DocumentPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sources?: Source[];
  highlights?: Record<string, HighlightArea[]>;
  retrievedChunks?: RetrievedChunk[];
}

export default function DocumentPreviewSheet({
  open,
  onOpenChange,
  sources = [],
  highlights = {},
  retrievedChunks = [],
}: DocumentPreviewSheetProps) {
  // State for selected file
  const [selectedSource, setSelectedSource] = React.useState<Source | null>(
    null
  );
  const [activeTab, setActiveTab] = React.useState<string>("pdf");
  const [currentHighlightAreas, setCurrentHighlightAreas] = React.useState<
    HighlightArea[]
  >([]);

  // Initialize selected source when sources change
  React.useEffect(() => {
    if (sources.length > 0 && !selectedSource) {
      setSelectedSource(sources[0]);
    }
  }, [sources, selectedSource]);

  // Update highlight areas when selected source changes
  React.useEffect(() => {
    if (selectedSource) {
      const areas = highlights[selectedSource.url] || [];
      setCurrentHighlightAreas(areas);
    }
  }, [selectedSource, highlights]);

  // Filter chunks for selected source
  const filteredChunks = React.useMemo(() => {
    if (!selectedSource) return [];
    return retrievedChunks.filter((chunk) => chunk.url === selectedSource.url);
  }, [selectedSource, retrievedChunks]);

  // Convert highlightAreas to internal format for rendering
  const highlightsInternal = React.useMemo(() => {
    return currentHighlightAreas
      .filter((area) => area && typeof area.pageIndex === 'number')
      .map((area, idx) => ({
        id: idx,
        content: `Highlight on page ${(area.pageIndex ?? 0) + 1}`,
        highlightAreas: [area],
        quote: "",
      }));
  }, [currentHighlightAreas]);

  const renderHighlights = (props: any) => (
    <div>
      {currentHighlightAreas
        .filter((area) => area && typeof area.pageIndex === 'number' && area.pageIndex === props.pageIndex)
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
              props.getCssProperties && props.getCssProperties(area, props.rotation)
            )}
            title={`Page ${(area.pageIndex ?? 0) + 1}`}
          />
        ))}
    </div>
  );

  // Transform toolbar to remove Open File button
  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Open: () => <></>,
    OpenMenuItem: () => <></>,
  });

  // Initialize plugins
  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  const fullScreenPluginInstance = fullScreenPlugin({
    enableShortcuts: true,
  });

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Keep thumbnails tab
      {
        content: sidebarNotes,
        icon: <MessageIcon />,
        title: "Highlights",
      },
    ],
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
        Highlights ({currentHighlightAreas.length})
      </h3>
      {currentHighlightAreas.length === 0 && (
        <div>No highlights available</div>
      )}
      {highlightsInternal.map((note) => (
        note?.content ? (
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
        ) : null
      ))}
    </div>
  );

  // Handle source selection
  const handleSourceSelect = (source: Source) => {
    setSelectedSource(source);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[95%] sm:max-w-7xl p-0 flex flex-col bg-zinc-100 dark:bg-zinc-900 border-l">
        {/* Header */}
        <SheetHeader className="p-4 border-b bg-white dark:bg-zinc-950 shrink-0">
          {/* Title area với dropdown trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2 justify-between cursor-pointer hover:bg-muted/50 rounded-md p-2 -m-2 transition-colors w-fit">
                <div className="flex-1">
                  <SheetTitle className="flex items-center gap-2 text-base">
                    <FileText className="w-4 h-4" />
                    {selectedSource?.source || "Document Preview"}
                  </SheetTitle>
                  <SheetDescription>
                    {sources.length > 1
                      ? `${sources.length} sources available. Click to switch.`
                      : "View document with highlighted source references"}
                  </SheetDescription>
                </div>
                {sources.length > 1 && (
                  <ChevronDown className="w-4 h-4 text-muted-foreground mt-1" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {sources.map((source, idx) => (
                <DropdownMenuItem
                  key={idx}
                  onClick={() => handleSourceSelect(source)}
                  className={`flex items-center gap-3 py-3 px-3 cursor-pointer ${selectedSource?.url === source.url
                    ? 'bg-primary/10 text-primary font-medium'
                    : ''
                    }`}
                >
                  <FileText className={`w-5 h-5 shrink-0 ${selectedSource?.url === source.url
                    ? 'text-primary'
                    : 'text-muted-foreground'
                    }`} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">
                      {source.source}
                    </p>
                    {source.page && (
                      <p className="text-xs text-muted-foreground">
                        Page {source.page}
                      </p>
                    )}
                  </div>
                  {selectedSource?.url === source.url && (
                    <Check className="w-4 h-4 text-primary shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetHeader>

        {/* Tabs for PDF Viewer and Raw Text */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Buttons */}
          <div className="mx-4 mt-2 w-fit flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab("pdf")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "pdf"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <FileText className="w-4 h-4" />
              PDF Viewer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("raw")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "raw"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <FileCode className="w-4 h-4" />
              Raw Retrieved Docs
            </button>
          </div>

          {/* PDF Viewer Tab - Keep mounted for caching */}
          <div className={`flex-1 overflow-hidden m-4 mt-2 ${activeTab === "pdf" ? "block" : "hidden"}`}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              {selectedSource && selectedSource.url ? (
                <Viewer
                  key={selectedSource.url}
                  fileUrl={selectedSource.url}
                  initialPage={(selectedSource.page ?? 0) - 1}
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
          </div>

          {/* Raw Text Tab */}
          <div className={`flex-1 overflow-auto m-4 mt-2 pr-2 ${activeTab === "raw" ? "block" : "hidden"}`}>
            <div className="space-y-4 pb-8">
              {/* Header with source filter */}
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Found {filteredChunks.length} chunks
                  {sources.length > 1 && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (from {selectedSource?.source || "unknown"})
                    </span>
                  )}
                </h3>
              </div>

              {filteredChunks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground animate-in fade-in-50">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <FileCode className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                  <p>No retrieved chunks for this file</p>
                </div>
              )}

              {/* Render danh sách chunk */}
              <div className="grid gap-4">
                {filteredChunks.map((chunk, idx) => (
                  <ChunkCard key={chunk.id} chunk={chunk} index={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
