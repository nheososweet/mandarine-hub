"use client";

import { use } from "react";
import BlurText from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import { FileList } from "../_components/FileList";
import { ArrowLeft, Settings, Plus, Play } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function KnowledgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // https://nextjs.org/docs/messages/sync-dynamic-apis#possible-ways-to-fix-it
  // Unwrapping params with use() for Next.js 15+
  const resolvedParams = use(params);
  const kbId = resolvedParams.id;

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Link href="/knowledge" className="hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-sm">Back to List</span>
          </div>
          <div className="flex items-center gap-3">
            <BlurText
              text="Engineering Documentation" // Mock Name
              className="text-2xl font-bold tracking-tight"
              delay={10}
            />
            <Badge variant="outline" className="text-green-500 bg-green-500/10 border-green-500/20">
              Active
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Central knowledge base for backend and frontend engineering standards, API references, and architecture diagrams.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm">
            <Play className="mr-2 h-4 w-4" /> Test Chat
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Source
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <Tabs defaultValue="files" className="h-full space-y-6">
          <TabsList>
            <TabsTrigger value="files">Files & Sources</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="settings">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="files" className="border-none p-0 outline-none">
             <div className="bg-card rounded-xl border p-4">
                <FileList />
             </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
              Activity log placeholder
            </div>
          </TabsContent>

           <TabsContent value="settings">
            <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
              Settings form placeholder
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
