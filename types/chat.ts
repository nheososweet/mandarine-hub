import { LucideIcon } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  attachments?: MessageAttachment[];
  isStreaming?: boolean;
}

export interface MessageAttachment {
  id: string;
  type: "image" | "file" | "audio";
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
  messageCount: number;
  model?: string;
  isPinned?: boolean;
}

export interface ChatModel {
  id: string;
  name: string;
  provider: string;
  icon?: LucideIcon;
  maxTokens?: number;
}
