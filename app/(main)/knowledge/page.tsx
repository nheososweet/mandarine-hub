"use client";

import React, { useState } from "react";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  File,
  Search,
  Trash2,
  Download,
  Eye,
  Filter,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import BlurText from "@/components/BlurText";
import SpotlightCard from "@/components/SpotlightCard";

interface KnowledgeFile {
  id: string;
  name: string;
  type: "pdf" | "doc" | "image" | "text";
  size: number;
  uploadedAt: Date;
  status: "processing" | "ready" | "error";
  chunks?: number;
}

export default function KnowledgePage() {
  const [files, setFiles] = useState<KnowledgeFile[]>([
    {
      id: "1",
      name: "Product Documentation.pdf",
      type: "pdf",
      size: 2400000,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: "ready",
      chunks: 145,
    },
    {
      id: "2",
      name: "API Reference.md",
      type: "text",
      size: 56000,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: "ready",
      chunks: 23,
    },
    {
      id: "3",
      name: "Architecture Diagram.png",
      type: "image",
      size: 890000,
      uploadedAt: new Date(Date.now() - 1000 * 60 * 30),
      status: "processing",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const readyFiles = files.filter((f) => f.status === "ready").length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: Implement file upload logic
    console.log("Files selected:", e.target.files);
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <BlurText
              text="Knowledge Base"
              className="text-2xl font-bold text-foreground mb-1"
              delay={10}
            />
            <p className="text-muted-foreground text-sm">
              Upload and manage documents for RAG-powered conversations
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SpotlightCard className="bg-card! border border-border rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg border border-primary/30">
                <FileText className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {files.length}
                </p>
                <p className="text-xs text-muted-foreground">Total Files</p>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="bg-card! border border-border rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <Upload className="size-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {readyFiles}
                </p>
                <p className="text-xs text-muted-foreground">Ready</p>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="bg-card! border border-border rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <FileText className="size-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatBytes(totalSize)}
                </p>
                <p className="text-xs text-muted-foreground">Total Size</p>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Upload Area */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Upload Documents</CardTitle>
            <CardDescription>
              Add PDFs, documents, images, or text files to your knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer hover:bg-accent/50 transition-colors border-border bg-background/50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="size-12 text-muted-foreground mb-4" />
                <p className="mb-2 text-sm text-foreground">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC, TXT, MD, PNG, JPG (Max 10MB)
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
              />
            </label>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Your Documents</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-[200px]"
                  />
                </div>
                <Button size="icon" variant="ghost">
                  <Filter className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-primary/10 rounded-lg border border-primary/30">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            file.status === "ready"
                              ? "default"
                              : file.status === "processing"
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-[10px]"
                        >
                          {file.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatBytes(file.size)}
                        </span>
                        {file.chunks && (
                          <span className="text-xs text-muted-foreground">
                            • {file.chunks} chunks
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          • {formatDate(file.uploadedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="size-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="size-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {filteredFiles.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="size-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? "No files found"
                      : "No documents uploaded yet"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
    case "doc":
      return <FileText className="size-5 text-primary" />;
    case "image":
      return <ImageIcon className="size-5 text-primary" />;
    default:
      return <File className="size-5 text-primary" />;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
