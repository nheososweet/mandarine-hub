"use client";

import { useEffect, useState } from "react";
import BlurText from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import SpotlightCard from "@/components/SpotlightCard";
import { Badge } from "@/components/ui/badge";
import { Bot, Settings2, Power, Terminal, MoreHorizontal, Edit, Copy, Trash, FileText, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateAgentDialog } from "./_components/CreateAgentDialog";
import { AgentLogsDialog } from "./_components/AgentLogsDialog";
import { faker } from "@faker-js/faker";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Agent = {
  id: string;
  name: string;
  description: string;
  model: string;
  status: "Running" | "Idle" | "Stopped";
  role?: string;
};

export default function AgentsPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [mounted, setMounted] = useState(false);

  // Modal States
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [viewingLogsAgent, setViewingLogsAgent] = useState<string | null>(null);

  useEffect(() => {
    // Initialize fake data only on client
    const initialAgents: Agent[] = Array.from({ length: 6 }).map(() => ({
      id: faker.string.uuid(),
      name: faker.person.jobType() + " Agent",
      description: faker.company.catchPhrase(),
      model: faker.helpers.arrayElement(["GPT-4o", "Claude 3.5", "Llama 3"]),
      status: faker.helpers.arrayElement(["Running", "Idle", "Stopped"]),
      role: "This agent helps with automated tasks.",
    }));
    setAgents(initialAgents);
    setMounted(true);
  }, []);

  const handleStart = (id: string, name: string) => {
      setAgents(prev => prev.map(a => a.id === id ? { ...a, status: "Running" } : a));
      toast.success(`Agent ${name} started successfully.`);
  };

  const handleStop = (id: string, name: string) => {
      setAgents(prev => prev.map(a => a.id === id ? { ...a, status: "Stopped" } : a));
      toast.error(`Agent ${name} stopped.`);
  };

  const handleDelete = (id: string, name: string) => {
      setAgents(prev => prev.filter(a => a.id !== id));
      toast.success(`Agent ${name} deleted.`);
  };

  const handleClone = (agent: Agent) => {
      const newAgent = { ...agent, id: faker.string.uuid(), name: `${agent.name} (Copy)`, status: "Stopped" as const };
      setAgents(prev => [...prev, newAgent]);
      toast.success(`Agent ${agent.name} cloned.`);
  };
  
  const handleChat = (agent: Agent) => {
      if (agent.status !== "Running") {
          toast.warning(`Agent ${agent.name} is not running. Please start it first.`);
          return;
      }
      router.push(`/chat/${agent.id}`);
  };

  if (!mounted) return null;

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <BlurText
            text="Agents"
            className="text-2xl font-bold tracking-tight"
            delay={10}
          />
          <p className="text-muted-foreground">
            Deploy and manage your autonomous workforce.
          </p>
        </div>
        <CreateAgentDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {agents.map((agent) => (
             <SpotlightCard 
                key={agent.id} 
                className="bg-card border-border rounded-xl p-6 h-full flex flex-col"
                spotlightColor="rgba(255, 255, 255, 0.05)"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <Bot className="w-6 h-6"/>
                    </div>
                    <Badge variant={agent.status === "Running" ? "default" : agent.status === "Stopped" ? "destructive" : "secondary"}>
                         {agent.status}
                    </Badge>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{agent.name}</h3>
                <p className="text-sm text-muted-foreground flex-1 mb-4 line-clamp-2">
                    {agent.description}
                </p>

                <div className="flex items-center gap-2 mb-6">
                    <Badge variant="outline" className="text-xs font-mono">
                         <Terminal className="w-3 h-3 mr-1" />
                         {agent.model}
                    </Badge>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                    <Button 
                        className={`flex-1 hover:bg-primary/20 border-primary/20 ${agent.status === "Running" ? "bg-primary/10 text-primary" : "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"}`}
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleChat(agent)}
                        disabled={agent.status !== "Running"}
                    >
                        <MessageSquare className="w-4 h-4 mr-2" /> Chat
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={() => setEditingAgent(agent)}>
                        <Settings2 className="w-4 h-4" /> 
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingAgent(agent)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleClone(agent)}>
                          <Copy className="mr-2 h-4 w-4" /> Clone
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setViewingLogsAgent(agent.name)}>
                          <FileText className="mr-2 h-4 w-4" /> View Logs
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {agent.status === "Stopped" || agent.status === "Idle" ? (
                           <DropdownMenuItem className="text-green-500" onClick={() => handleStart(agent.id, agent.name)}>
                               <Power className="mr-2 h-4 w-4" /> Start Agent
                           </DropdownMenuItem>
                        ) : (
                           <DropdownMenuItem className="text-red-500" onClick={() => handleStop(agent.id, agent.name)}>
                               <Power className="mr-2 h-4 w-4" /> Stop Agent
                           </DropdownMenuItem>
                        )}
                         <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-50 focus:bg-red-900/10" onClick={() => handleDelete(agent.id, agent.name)}>
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
             </SpotlightCard>
         ))}
      </div>

      {/* Edit Agent Dialog (Controlled) */}
      <CreateAgentDialog 
        agent={editingAgent} 
        open={!!editingAgent} 
        onOpenChange={(open) => !open && setEditingAgent(null)} 
      />

      {/* Logs Dialog */}
      {viewingLogsAgent && (
          <AgentLogsDialog 
            agentName={viewingLogsAgent} 
            open={!!viewingLogsAgent} 
            onOpenChange={(open) => !open && setViewingLogsAgent(null)} 
          />
      )}
    </div>
  );
}
