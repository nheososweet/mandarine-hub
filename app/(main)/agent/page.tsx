"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Pin,
  Trash2,
  PenLine,
  MessageSquare,
  Send,
  Bot,
  User,
  Paperclip,
  Menu, // Icon Menu cho Mobile
  Cpu,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"; // Component Sheet của Shadcn cho Mobile
import { cn } from "@/lib/utils";

// --- TYPES ---
interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
  isPinned: boolean;
  isActive: boolean;
}

// --- MOCK DATA ---
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    title: "Phân tích Token Q3",
    lastMessage: "Chi phí giảm 20% so với tháng trước",
    time: "10:30 AM",
    isPinned: true,
    isActive: true,
  },
  {
    id: "2",
    title: "Debug Agent Python",
    lastMessage: "Đã tìm thấy lỗi memory leak",
    time: "Yesterday",
    isPinned: true,
    isActive: false,
  },
  {
    id: "3",
    title: "Viết Content Marketing",
    lastMessage: "Cần thêm 3 variation nữa",
    time: "2 days ago",
    isPinned: false,
    isActive: false,
  },
  {
    id: "4",
    title: "Học Rust Basic",
    lastMessage: "Khái niệm Ownership khó hiểu quá",
    time: "Last week",
    isPinned: false,
    isActive: false,
  },
  {
    id: "5",
    title: "Dịch tài liệu",
    lastMessage: "File PDF đã được xử lý",
    time: "2 weeks ago",
    isPinned: false,
    isActive: false,
  },
  {
    id: "6",
    title: "Lên kế hoạch du lịch",
    lastMessage: "Tìm vé máy bay giá rẻ",
    time: "1 month ago",
    isPinned: false,
    isActive: false,
  },
  {
    id: "7",
    title: "Review Code PR",
    lastMessage: "Đã merge vào nhánh main",
    time: "1 month ago",
    isPinned: false,
    isActive: false,
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Chào bạn! Tôi là Mandarine AI. Hệ thống Dashboard báo cáo mọi chỉ số đều ổn định. Tôi có thể giúp gì thêm?",
    timestamp: "10:30 AM",
  },
];

// ==========================================
// 1. REUSABLE COMPONENT: SIDEBAR CONTENT
// (Dùng chung cho cả Desktop Sidebar và Mobile Drawer)
// ==========================================
const SidebarContent = ({
  conversations,
  onSelect,
}: {
  conversations: Conversation[];
  onSelect: (id: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-500/10 rounded-lg border border-orange-500/20 text-orange-500">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            Mandarine Chat
          </span>
        </div>

        <Button className="w-full justify-start gap-2 bg-foreground text-background hover:bg-accent font-semibold shadow-lg">
          <Plus className="w-4 h-4" /> New Chat
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-accent border-border text-xs focus-visible:ring-1 focus-visible:ring-orange-500/50 rounded-lg"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {filteredConversations.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={cn(
              "group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border",
              chat.isActive
                ? "bg-accent border-border shadow-[0_0_15px_-5px_rgba(249,115,22,0.15)]"
                : "border-transparent hover:bg-accent text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Active Indicator Bar (Optional style) */}
            {chat.isActive && (
              <div className="absolute left-0 top-3 bottom-3 w-1 bg-orange-500 rounded-r-full" />
            )}

            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold border transition-colors ml-1",
                chat.isActive
                  ? "bg-orange-500/10 border-orange-500/20 text-orange-500"
                  : "bg-accent border-border text-muted-foreground"
              )}
            >
              {chat.title.charAt(0)}
            </div>

            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex justify-between items-center mb-0.5">
                <span
                  className={cn(
                    "text-sm font-medium truncate",
                    chat.isActive && "text-foreground"
                  )}
                >
                  {chat.title}
                </span>
                {chat.isPinned && (
                  <Pin className="w-3 h-3 text-orange-500 shrink-0 ml-1" />
                )}
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {chat.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-accent shrink-0 m-2 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-foreground font-bold text-xs">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">
              Admin User
            </div>
            <div className="text-[10px] text-muted-foreground">Pro Plan</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. COMPONENT: CHAT AREA (Header + Messages + Input)
// ==========================================
const ChatArea = ({
  messages,
  isLoading,
  onSend,
  conversations, // Need this to pass to Mobile Sidebar
  onSelectConversation,
}: {
  messages: Message[];
  isLoading: boolean;
  onSend: (val: string) => void;
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
}) => {
  const [value, setValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value);
      setValue("");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-background relative">
      {/* --- CHAT HEADER (With Mobile Toggle) --- */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground -ml-2"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 w-80 border-r border-border bg-background"
              >
                <SidebarContent
                  conversations={conversations}
                  onSelect={onSelectConversation}
                />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <div>
              <h3 className="text-sm font-bold text-foreground leading-none">
                Phân tích Token Q3
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1">
                GPT-4o • Active
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hidden sm:flex"
          >
            <Search className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-accent border-border text-foreground"
            >
              <DropdownMenuItem className="hover:bg-accent cursor-pointer">
                Export Chat
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="text-red-400 hover:bg-accent cursor-pointer">
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* --- MESSAGES LIST (Scrollable) --- */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          {messages.map((msg) => {
            const isAI = msg.role === "ai";
            return (
              <div
                key={msg.id}
                className={cn("flex gap-4", !isAI && "flex-row-reverse")}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm",
                    isAI
                      ? "bg-accent border-border text-orange-500 shadow-orange-500/10"
                      : "bg-accent border-border text-muted-foreground"
                  )}
                >
                  {isAI ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "flex flex-col max-w-[85%] sm:max-w-[75%]",
                    !isAI && "items-end"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] text-muted-foreground font-mono uppercase">
                      {isAI ? "Mandarine AI" : "You"}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-md border",
                      isAI
                        ? "bg-accent border-border text-foreground rounded-tl-none"
                        : "bg-orange-600 border-orange-500/20 text-white rounded-tr-none shadow-lg shadow-orange-900/20"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-accent border border-border flex items-center justify-center text-orange-500 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 h-10 px-4 bg-accent border border-border rounded-2xl rounded-tl-none">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* --- INPUT AREA (Fixed Bottom) --- */}
      <div className="p-4 border-t border-border bg-background shrink-0 z-10">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center gap-2 bg-accent border border-border rounded-xl p-2 focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/20 transition-all duration-300 shadow-sm"
          >
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent shrink-0 rounded-lg"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask Mandarine anything..."
              className="border-none shadow-none bg-transparent focus-visible:ring-0 h-9 px-2 text-sm text-foreground placeholder:text-muted-foreground font-sans"
            />

            <Button
              type="submit"
              size="icon"
              disabled={!value.trim() || isLoading}
              className={cn(
                "h-8 w-8 shrink-0 transition-all rounded-lg",
                value.trim()
                  ? "bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-accent text-muted-foreground hover:bg-accent"
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="text-center mt-2 flex justify-center gap-3">
            <span className="text-[10px] text-muted-foreground font-mono">
              Encryption: AES-256
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              Latency: 24ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN PAGE: CHAT PAGE
// ==========================================
export default function ChatPage() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);

  // Logic: Select Conversation
  const handleSelectConversation = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => ({ ...c, isActive: c.id === id }))
    );
    // In real app, fetch messages for this conversation here
  };

  // Logic: Send Message
  const handleSend = (content: string) => {
    const newMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content:
          "Yêu cầu đã được tiếp nhận. Dữ liệu Dashboard đang được cập nhật...",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    // FIX LAYOUT: h-screen & w-full để chiếm toàn bộ màn hình
    // overflow-hidden ở root để ngăn thanh cuộn của trình duyệt
    <div className="flex h-screen w-full bg-background text-foreground font-sans overflow-hidden selection:bg-orange-500/30">
      {/* DESKTOP SIDEBAR: Ẩn trên mobile, hiện trên md (768px trở lên) */}
      <div className="hidden md:flex w-80 shrink-0 border-r border-border z-10">
        <SidebarContent
          conversations={conversations}
          onSelect={handleSelectConversation}
        />
      </div>

      {/* CHAT AREA: Chiếm phần còn lại */}
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        onSend={handleSend}
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
      />
    </div>
  );
}
