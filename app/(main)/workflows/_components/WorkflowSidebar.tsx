"use client";

import { Bot, Users, Grab } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function WorkflowSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, data: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("application/reactflow-data", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 border-r bg-muted/20 p-4 space-y-4 h-full flex flex-col">
      <div className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
        Available Units
      </div>
      
      <div className="space-y-3">
        {/* TEAM NODE DRAGGABLE */}
        <div
            className="cursor-grab active:cursor-grabbing"
            onDragStart={(event) => onDragStart(event, "agent", { role: "Team", isTeam: true, label: "New Team" })}
            draggable
        >
             <Card className="p-3 flex items-center gap-3 hover:border-primary transition-colors bg-card">
                 <div className="p-2 bg-orange-500/10 rounded-md">
                     <Users className="w-4 h-4 text-orange-500" />
                 </div>
                 <div className="text-sm font-medium">Create Team</div>
             </Card>
        </div>

        {/* AGENT NODE DRAGGABLE */}
        <div
            className="cursor-grab active:cursor-grabbing"
            onDragStart={(event) => onDragStart(event, "agent", { role: "Worker", isTeam: false, label: "New Agent" })}
            draggable
        >
             <Card className="p-3 flex items-center gap-3 hover:border-primary transition-colors bg-card">
                 <div className="p-2 bg-blue-500/10 rounded-md">
                     <Bot className="w-4 h-4 text-blue-500" />
                 </div>
                 <div className="text-sm font-medium">Create Agent</div>
             </Card>
        </div>
      </div>

      <div className="mt-auto p-4 bg-muted/30 rounded-lg text-xs text-muted-foreground">
          <p className="mb-2 font-semibold">Hierarchy Rules:</p>
          <ul className="list-disc pl-4 space-y-1">
              <li>Team (Level 1)</li>
              <li>Sub-Team or Agent (Level 2)</li>
              <li>Agent only (Level 3)</li>
          </ul>
      </div>
    </div>
  );
}
