"use client";

import React, { useState } from "react";
import { Search, Plus, MessageSquare, Clock, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SpotlightCard from "@/components/SpotlightCard";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isPinned?: boolean;
  unreadCount?: number;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    title: "Research AI Agents",
    lastMessage: "Can you help me understand how multi-agent systems work?",
    timestamp: "2 mins ago",
    isPinned: true,
  },
  {
    id: "2",
    title: "Code Review Assistant",
    lastMessage: "Review the authentication flow in my Next.js app",
    timestamp: "1 hour ago",
    unreadCount: 2,
  },
  {
    id: "3",
    title: "Data Analysis Helper",
    lastMessage: "Analyze this dataset and provide insights",
    timestamp: "3 hours ago",
  },
  {
    id: "4",
    title: "Content Writer",
    lastMessage: "Generate blog post about AI trends",
    timestamp: "Yesterday",
  },
  {
    id: "5",
    title: "SQL Query Generator",
    lastMessage: "Create a complex join query for customer analytics",
    timestamp: "2 days ago",
  },
  {
    id: "6",
    title: "API Documentation",
    lastMessage: "Help me write OpenAPI specs for REST endpoints",
    timestamp: "3 days ago",
  },
  {
    id: "7",
    title: "Bug Debugger",
    lastMessage: "Why is my React component re-rendering infinitely?",
    timestamp: "1 week ago",
  },
];

export default function AgentSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string>("1");

  const filteredConversations = MOCK_CONVERSATIONS.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned);
  const regularConversations = filteredConversations.filter((c) => !c.isPinned);

  return (
    <div className="flex w-80 flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Agent Chat</h2>
          </div>
          <Button
            size="sm"
            className="h-8 w-8 rounded-lg bg-primary p-0 hover:bg-primary/80"
            title="New Chat"
          >
            <Plus className="h-4 w-4 text-primary-foreground" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 rounded-lg border-border bg-accent pl-9 text-sm placeholder:text-muted-foreground focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Conversations List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned Section */}
        {pinnedConversations.length > 0 && (
          <div className="border-b border-border/50 p-2">
            <div className="mb-2 flex items-center gap-1.5 px-2">
              <Pin className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Pinned
              </span>
            </div>
            <div className="space-y-1">
              {pinnedConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedConversation === conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Conversations */}
        <div className="p-2">
          {regularConversations.length > 0 ? (
            <div className="space-y-1">
              {regularConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedConversation === conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No conversations found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-border bg-accent/50 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {filteredConversations.length} conversations
          </span>
          <div className="flex items-center gap-1 text-green-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            <span className="font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-lg p-3 text-left transition-all",
        "hover:bg-accent",
        isSelected && "bg-accent border border-primary/20"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3
              className={cn(
                "truncate text-sm font-semibold transition-colors",
                isSelected
                  ? "text-foreground"
                  : "text-foreground group-hover:text-foreground"
              )}
            >
              {conversation.title}
            </h3>
            {conversation.isPinned && (
              <Pin className="h-3 w-3 shrink-0 text-primary" />
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {conversation.lastMessage}
          </p>
        </div>
        {conversation.unreadCount && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {conversation.unreadCount}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{conversation.timestamp}</span>
      </div>
    </button>
  );
}
