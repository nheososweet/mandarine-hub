"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, Terminal } from "lucide-react";

type AgentLogsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentName: string;
};

// Mock logs data
const logs = [
    { time: "10:42:05", level: "info", message: "Agent initialized successfully." },
    { time: "10:42:06", level: "info", message: "Loaded model configuration: GPT-4o" },
    { time: "10:45:12", level: "info", message: "Received user input: 'Analyze Q3 report'" },
    { time: "10:45:15", level: "warn", message: "High latency detected in vector store retrieval (205ms)" },
    { time: "10:45:18", level: "info", message: "Response generated. Tokens: 450 in / 210 out." },
    { time: "11:02:30", level: "error", message: "Connection timeout retry (1/3)" },
    { time: "11:02:32", level: "info", message: "Connection re-established." },
];

export function AgentLogsDialog({ open, onOpenChange, agentName }: AgentLogsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-muted-foreground" />
              Logs: {agentName}
          </DialogTitle>
          <DialogDescription>
            System activities and execution logs for this agent.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 bg-black/90 rounded-md border text-xs font-mono p-4 overflow-hidden flex flex-col">
             <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 text-muted-foreground">
                 <span>Timestamp</span>
                 <span>Message</span>
             </div>
             <ScrollArea className="flex-1">
                 <div className="space-y-1">
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-4 hover:bg-white/5 p-1 rounded">
                            <span className="text-zinc-500 shrink-0 w-20">{log.time}</span>
                            <div className="flex-1 break-all">
                                {log.level === "error" ? (
                                    <span className="text-red-400 font-bold">[ERROR] </span>
                                ) : log.level === "warn" ? (
                                    <span className="text-yellow-400 font-bold">[WARN]  </span>
                                ) : (
                                    <span className="text-blue-400 font-bold">[INFO]  </span>
                                )}
                                <span className="text-zinc-300">{log.message}</span>
                            </div>
                        </div>
                    ))}
                    <div className="text-zinc-500 italic mt-4">-- End of current logs --</div>
                 </div>
             </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
