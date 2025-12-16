// components/flow/AgentNode.tsx
import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Cpu } from "lucide-react";

const colorMap: any = {
  orange: "border-orange-500/50 bg-orange-500/10 text-orange-400",
  blue: "border-blue-500/50 bg-blue-500/10 text-blue-400",
  red: "border-red-500/50 bg-red-500/10 text-red-400",
  purple: "border-purple-500/50 bg-purple-500/10 text-purple-400",
};

export default memo(({ data }: any) => {
  return (
    <div className="relative min-w-[200px] bg-zinc-900/90 border border-white/10 rounded-xl overflow-hidden shadow-xl backdrop-blur-md hover:border-white/30 transition-all">
      {/* Input Handle (Cổng vào - Trên) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-zinc-400 !w-2 !h-2 !-top-1"
      />

      <div className="p-4">
        {/* Header: Role */}
        <div className="text-[10px] font-mono text-zinc-500 mb-1 uppercase tracking-wider">
          {data.role}
        </div>

        {/* Body: Name */}
        <div className="text-white font-bold text-sm mb-3">{data.label}</div>

        {/* Footer: Model Badge */}
        <div
          className={`
            inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-mono font-medium
            ${colorMap[data.color || "blue"]}
        `}
        >
          <Cpu className="w-3 h-3" />
          {data.model}
        </div>
      </div>

      {/* Output Handle (Cổng ra - Dưới) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-zinc-400 !w-2 !h-2 !-bottom-1"
      />
    </div>
  );
});
