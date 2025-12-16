"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import BlurText from "@/components/BlurText";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI agent assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    role: "user",
    content: "Can you explain how multi-agent systems work in AI?",
    timestamp: new Date(Date.now() - 3500000),
  },
  {
    id: "3",
    role: "assistant",
    content: `Multi-agent systems (MAS) are computational systems where multiple intelligent agents interact or work together to solve problems that are beyond the capabilities of individual agents.

Key concepts:

**1. Agent Architecture**
- Each agent has autonomy to make decisions
- Agents perceive their environment through sensors
- Agents act on their environment through actuators

**2. Communication**
- Agents exchange information through protocols
- Message passing enables coordination
- Common languages like FIPA-ACL facilitate interaction

**3. Coordination Strategies**
- Cooperation: Working towards shared goals
- Competition: Agents with conflicting objectives
- Negotiation: Finding mutually acceptable solutions

Would you like me to dive deeper into any specific aspect?`,
    timestamp: new Date(Date.now() - 3400000),
  },
  {
    id: "4",
    role: "user",
    content: "Yes, tell me more about coordination strategies.",
    timestamp: new Date(Date.now() - 120000),
  },
];

export default function AgentChatArea() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "This is a simulated response. In production, this would be connected to your AI backend.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <BlurText
              text="Agent Conversation"
              className="text-lg font-bold text-foreground"
              delay={10}
            />
            <p className="text-xs text-muted-foreground">
              Powered by GPT-4o • Real-time responses
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-accent px-3 py-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground">
              AI Active
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area - SCROLLABLE */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))
          )}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - FIXED AT BOTTOM */}
      <div className="border-t border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="relative flex items-end gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift + Enter for new line)"
              className="min-h-[60px] max-h-[200px] resize-none rounded-xl border-border bg-accent pr-12 text-sm placeholder:text-muted-foreground focus-visible:ring-primary"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-lg bg-primary hover:bg-primary/80"
            >
              <Send className="h-4 w-4 text-primary-foreground" />
            </Button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}

function MessageItem({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-4", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser
            ? "bg-primary/10 text-primary"
            : "border border-border bg-card text-foreground"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm",
            isUser
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-foreground"
          )}
        >
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
        <Bot className="h-4 w-4 text-foreground" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl border border-border bg-card px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        Start a conversation
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Ask me anything! I'm here to help with coding, research, analysis, and
        more.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {[
          "Explain a concept",
          "Debug code",
          "Write documentation",
          "Analyze data",
        ].map((suggestion) => (
          <button
            key={suggestion}
            className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground transition-colors hover:bg-accent"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
