"use client";

import BlurText from "@/components/BlurText";
import { CreateKbDialog } from "./_components/CreateKbDialog";
import { KnowledgeList } from "./_components/KnowledgeList";
import { KnowledgeStats } from "./_components/KnowledgeStats";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FolderOpen } from "lucide-react";

export default function KnowledgePage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-end justify-between space-y-2">
        <div>
          <BlurText
            text="Knowledge Base"
            className="text-2xl font-bold tracking-tight"
            delay={10}
          />
          <p className="text-muted-foreground">
            Manage your vector collections and document sources.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/knowledge/general">
            <Button variant="outline">
              <FolderOpen className="mr-2 h-4 w-4" /> General Files
            </Button>
          </Link>
          <CreateKbDialog />
        </div>
      </div>
      
      <KnowledgeStats />
      
      <div className="flex-1 bg-card rounded-xl border p-4">
        <KnowledgeList />
      </div>
    </div>
  );
}
