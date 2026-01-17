"use client";

import { useState, useCallback, useRef } from "react";
import BlurText from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
  OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CreateWorkflowSheet } from "./_components/CreateWorkflowSheet";
import WorkflowSidebar from "./_components/WorkflowSidebar";

// Import Custom Node
import AgentNode from "./_components/flows/AgentNode";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { nanoid } from "nanoid";

// Initial Data
const initialNodes = [
  {
    id: "1",
    type: "agent",
    position: { x: 300, y: 0 },
    data: {
      label: "Main Team",
      role: "Team",
      isTeam: true,
      model: "GPT-4o",
      color: "#f97316",
    },
  },
];

const nodeTypes = { agent: AgentNode };

// Helper to get node depth
const getNodeDepth = (nodeId: string, edges: Edge[]): number => {
    let depth = 1;
    let currentId = nodeId;
    
    // Safety break to prevent infinite loops in cyclic graphs (though we validate to prevent cycles ideally)
    let iterations = 0;
    
    while (true) {
        if(iterations > 10) break;
        const parentEdge = edges.find(e => e.target === currentId);
        if (!parentEdge) break;
        depth++;
        currentId = parentEdge.source;
        iterations++;
    }
    return depth;
};

const WorkflowsContent = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  
  // Sheet Configuration State
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // VALIDATION LOGIC
  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return false;

      // 1. Prevent circular connection (basic check)
      if (sourceNode.id === targetNode.id) return false;

      const sourceData = sourceNode.data as any;
      const targetData = targetNode.data as any;

      // 2. "Agent cannot contain agent" - Assuming "contain" means being a Source to a Target
      // If Source is NOT a Team, it cannot have children (it's a leaf agent)
      if (!sourceData.isTeam) {
          toast.error("Only Teams can have members/children.");
          return false;
      }

      // 3. Hierarchy Depth Check
      const sourceDepth = getNodeDepth(sourceNode.id, edges);
      // We are adding 1 level. 
      // If Source is Level 1 (Root Team), Target becomes Level 2.
      // If Source is Level 2 (Sub Team), Target becomes Level 3.
      // If Source is Level 3... Wait, Level 3 can't be a source if max is 3.
      
      if (sourceDepth >= 3) {
          toast.error("Maximum hierarchy depth (3 levels) reached.");
          return false;
      }
      
      // 4. If Source is Level 2 (Sub Team), Target MUST be an Agent (cannot be another Team)
      // "Trong team con thì chỉ được một cấp agent nữa thôi" -> Level 3 must be agents.
      if (sourceDepth === 2 && targetData.isTeam) {
           toast.error("Level 3 cannot be a Team. Only Agents allowed.");
           return false;
      }

      return true;
    },
    [nodes, edges]
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
        if (!isValidConnection(params)) return;
        setEdges((eds) => addEdge({ ...params, type: "smoothstep", animated: true }, eds));
    },
    [setEdges, isValidConnection]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      const dataString = event.dataTransfer.getData("application/reactflow-data");

      if (typeof type === "undefined" || !type || !dataString) {
        return;
      }

      const data = JSON.parse(dataString);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: nanoid(),
        type,
        position,
        data: { 
            ...data, 
            label: `${data.label} ${nodes.length + 1}`,
            color: data.isTeam ? "#f97316" : "#3b82f6" 
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, nodes.length, setNodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSheetOpen(true);
  }, []);

  return (
      <div className="flex h-full">
         <WorkflowSidebar />
         
         <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                 <Button variant="outline" size="sm">Save Layout</Button>
                 <CreateWorkflowSheet />
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClick}
                isValidConnection={isValidConnection}
                fitView
                className="bg-background/50"
            >
                <Background color="#555" gap={20} size={1} />
                <Controls className="bg-muted border-border text-foreground fill-foreground" />
            </ReactFlow>
         </div>

         {/* Configuration Sheet */}
         <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent side="right" className="w-[400px] sm:w-[500px] border-l border-border shadow-2xl">
            <SheetHeader>
                <SheetTitle>Configure {(selectedNode?.data as any)?.isTeam ? "Team" : "Agent"}</SheetTitle>
                <SheetDescription>
                Adjust parameters for this unit.
                </SheetDescription>
            </SheetHeader>
            
            {selectedNode && (
                <div className="py-6 space-y-6">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input 
                            defaultValue={selectedNode.data.label as string} 
                            onChange={(e) => {
                                setNodes((nds) =>
                                nds.map((n) =>
                                    n.id === selectedNode.id
                                    ? { ...n, data: { ...n.data, label: e.target.value } }
                                    : n
                                )
                                );
                            }}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Input defaultValue={selectedNode.data.role as string} />
                        </div>
                        <div className="space-y-2">
                            <Label>Model</Label>
                            <Select defaultValue={selectedNode.data.model as string || "GPT-4o"}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GPT-4o">GPT-4o</SelectItem>
                                    <SelectItem value="Claude 3.5">Claude 3.5 Sonnet</SelectItem>
                                    <SelectItem value="Llama 3">Llama 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>System Instructions</Label>
                        <Textarea 
                            className="min-h-[200px] font-mono text-sm leading-relaxed" 
                            placeholder="You are a helpful assistant..."
                            defaultValue="You are a specialized agent designed to handle tasks within this workflow. Please analyze the input carefully and provide structured output."
                        />
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t">
                        <Button className="w-full" onClick={() => setSheetOpen(false)}>Done</Button>
                    </div>
                </div>
            )}
            </SheetContent>
        </Sheet>
      </div>
  );
};

export default function WorkflowsPage() {
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
             <div className="border-b p-4 px-8 bg-background z-10">
                 <BlurText
                    text="Visual Agent Swarm"
                    className="text-2xl font-bold tracking-tight"
                    delay={10}
                />
             </div>
             <ReactFlowProvider>
                 <WorkflowsContent />
             </ReactFlowProvider>
        </div>
    );
}
