"use client";

import BlurText from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import { FileList } from "../_components/FileList";
import { ArrowLeft, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function GeneralFilesPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Link href="/knowledge" className="hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-sm">Back to Knowledge Base</span>
          </div>
          <BlurText
            text="General Files"
            className="text-2xl font-bold tracking-tight"
            delay={10}
          />
          <p className="text-muted-foreground">
            Repo of all uploaded files across the organization.
          </p>
        </div>
        <Button>
          <UploadCloud className="mr-2 h-4 w-4" /> Upload Files
        </Button>
      </div>

      <div className="flex-1 bg-card rounded-xl border p-4">
        <FileList />
      </div>
    </div>
  );
}
