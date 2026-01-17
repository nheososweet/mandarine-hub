"use client";

import { Handle, Position, useHandleConnections } from "@xyflow/react";
import { Bot, Cpu, User, Users } from "lucide-react";
import { memo } from "react";

const AgentNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const connections = useHandleConnections({ type: 'target' });

  return (
    <div
      className={`relative min-w-[200px] rounded-lg border bg-card p-4 shadow-md transition-all ${
        selected ? "border-primary ring-2 ring-primary/20" : "border-border"
      }`}
    >
      {/* Top Handle: Input from Parent */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-muted-foreground !w-3 !h-3 !border-2 !border-background"
        isConnectable={connections.length === 0}
      />

      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted/50"
          style={{ borderColor: data.color || "#f97316" }}
        >
          {data.isTeam ? (
               <Users className="h-5 w-5" style={{ color: data.color || "#f97316" }} />
          ) : (
               <Bot className="h-5 w-5" style={{ color: data.color || "#f97316" }} />
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold">{data.label}</h3>
          <p className="text-xs text-muted-foreground">{data.role}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t pt-2">
         <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
            Model
         </span>
         <div className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-[10px] font-medium">
             <Cpu className="w-3 h-3" />
             {data.model}
         </div>
      </div>

      {/* Bottom Handle: Output to Children - Only for Teams */}
      {data.isTeam && (
        <Handle
            type="source"
            position={Position.Bottom}
            className="!bg-primary !w-3 !h-3 !border-2 !border-background"
        />
      )}
    </div>
  );
};

export default memo(AgentNode);
