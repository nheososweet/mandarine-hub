"use client";

import Sidebar from "@/components/chat/Sidebar/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { Suspense, use } from "react";
import { useParams } from "next/navigation";

export default function AgentChatPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  
  // In a real app, we would fetch the agent details via API using this ID
  // For now, we reuse the existing chat structure which provides the UI
  // But we could add a context provider here to inject the agentId into the chat system

  const hasEnvToken = !!process.env.NEXT_PUBLIC_OS_SECURITY_KEY;
  const envToken = process.env.NEXT_PUBLIC_OS_SECURITY_KEY || "";

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading Agent Chat...</div>}>
      <div className="flex h-full bg-background relative overflow-hidden">
        {/* We can hide sidebar or keep it. User asked for "màn chat đẹp". 
            Keeping sidebar for history is good standard. 
        */}
        <Sidebar hasEnvToken={hasEnvToken} envToken={envToken} />
        
        <div className="flex-1 flex flex-col h-full relative">
            {/* Optional Header for Agent Context */}
            {/* <div className="p-4 border-b flex items-center gap-2 bg-background/50 backdrop-blur z-10 absolute top-0 w-full">
                <Bot className="w-5 h-5 text-primary" />
                <span className="font-semibold">Agent {agentId}</span>
            </div> */}
            
            <ChatArea />
        </div>
      </div>
    </Suspense>
  );
}
