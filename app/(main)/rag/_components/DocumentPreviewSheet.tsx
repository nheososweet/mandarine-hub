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
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
  highlightPlugin,
  HighlightArea,
  MessageIcon,
} from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

interface Note {
  id: number;
  content: string;
  highlightAreas: HighlightArea[];
  quote: string;
}

interface DocumentPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DocumentPreviewSheet({
  open,
  onOpenChange,
}: DocumentPreviewSheetProps) {
  const [notes, setNotes] = React.useState<Note[]>([
    {
      id: 1,
      content: "Đây là ghi chú quan trọng về điều khoản đầu tiên",
      highlightAreas: [
        {
          left: 10,
          top: 15,
          width: 50,
          height: 5,
          pageIndex: 0,
        },
      ],
      quote: "Điều khoản và điều kiện",
    },
    {
      id: 2,
      content: "Cần chú ý đến phần này khi ký hợp đồng",
      highlightAreas: [
        {
          left: 5,
          top: 35,
          width: 70,
          height: 8,
          pageIndex: 0,
        },
      ],
      quote: "Trách nhiệm của bên A",
    },
    {
      id: 3,
      content: "Điểm quyết định trong thỏa thuận",
      highlightAreas: [
        {
          left: 15,
          top: 60,
          width: 60,
          height: 6,
          pageIndex: 0,
        },
      ],
      quote: "Quyền lợi bên B",
    },
  ]);

  const renderHighlights = (props: any) => (
    <div>
      {notes.map((note) => (
        <React.Fragment key={note.id}>
          {note.highlightAreas
            .filter((area) => area.pageIndex === props.pageIndex)
            .map((area, idx) => (
              <div
                key={idx}
                style={Object.assign(
                  {},
                  {
                    background: "yellow",
                    opacity: 0.3,
                    cursor: "pointer",
                  },
                  props.getCssProperties(area, props.rotation)
                )}
                title={note.content}
              />
            ))}
        </React.Fragment>
      ))}
    </div>
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const highlightPluginInstance = highlightPlugin({
    renderHighlights,
  });

  const sidebarNotes = (
    <div style={{ padding: "10px", overflow: "auto", height: "100%" }}>
      <h3 style={{ marginBottom: "10px" }}>Ghi chú ({notes.length})</h3>
      {notes.length === 0 && <div>Không có ghi chú</div>}
      {notes.map((note) => (
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
          <blockquote
            style={{
              marginTop: 0,
              marginBottom: "5px",
              fontStyle: "italic",
              color: "#666",
            }}
          >
            "{note.quote}"
          </blockquote>
          <p style={{ margin: 0, fontSize: "14px" }}>{note.content}</p>
        </div>
      ))}
    </div>
  );

  const defaultLayoutPluginInstanceWithTabs = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) =>
      defaultTabs.concat({
        content: sidebarNotes,
        icon: <MessageIcon />,
        title: "Ghi chú",
      }),
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[95%] sm:max-w-7xl p-0 flex flex-col bg-zinc-100 dark:bg-zinc-900 border-l">
        {/* Header */}
        <SheetHeader className="p-4 border-b bg-white dark:bg-zinc-950 shrink-0">
          <SheetTitle className="flex items-center gap-2 text-base">
            Title
          </SheetTitle>
          <SheetDescription>
            Xem tài liệu với các vùng highlight từ nguồn tham chiếu
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer
              fileUrl="/noiquy.pdf"
              plugins={[
                defaultLayoutPluginInstanceWithTabs,
                highlightPluginInstance,
              ]}
            />
          </Worker>
        </div>
      </SheetContent>
    </Sheet>
  );
}
