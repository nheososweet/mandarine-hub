"use client";

import { Database, FileText, HardDrive, Share2 } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";

const stats = [
  {
    title: "Total Knowledge Bases",
    value: "12",
    icon: Database,
    description: "+3 from last month",
  },
  {
    title: "Total Documents",
    value: "1,248",
    icon: FileText,
    description: "420 MB processed",
  },
  {
    title: "Vector Storage",
    value: "2.4 GB",
    icon: HardDrive,
    description: "45% dedicated usage",
  },
  {
    title: "Shared Resources",
    value: "8",
    icon: Share2,
    description: "Active across 5 teams",
  },
];

export function KnowledgeStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <SpotlightCard
          key={index}
          className="bg-card border-border rounded-xl p-6"
          spotlightColor="rgba(249, 115, 22, 0.1)"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
            <p className="text-xs text-muted-foreground/80">{stat.description}</p>
          </div>
        </SpotlightCard>
      ))}
    </div>
  );
}
