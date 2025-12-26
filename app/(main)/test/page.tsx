"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, AlertCircle, MessageSquare } from "lucide-react";
import MarkdownRenderer from "@/components/ui/typography/MarkdownRenderer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Alert = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative w-full rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive ${className}`}
  >
    {children}
  </div>
);

// Message type
interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const [hasFirstChunk, setHasFirstChunk] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  console.log("re-render")

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    setIsLoading(true);
    setStreamingContent("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/rag/chat-stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: userMessage }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Response body is null");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            setHasFirstChunk(true);

            if (data === "[DONE]") {
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: accumulatedContent },
              ]);
              setStreamingContent("");
              setIsLoading(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);

              if (parsed.content) {
                accumulatedContent += parsed.content;
                setStreamingContent(accumulatedContent);
              }
            } catch (parseError) {
              console.warn("Failed to parse chunk:", data);
            }
          }
        }
      }

      if (accumulatedContent) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: accumulatedContent },
        ]);
        setStreamingContent("");
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Yêu cầu đã bị hủy");
      } else {
        setError(err.message || "Không thể gửi tin nhắn");
      }
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
      setHasFirstChunk(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full p-6">
      <div className="flex flex-col w-full max-w-5xl mx-auto overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth p-6 space-y-4 custom-scrollbar" style={{ scrollbarWidth: "none" }}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <div className="p-4 bg-accent rounded-xl border border-border">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-foreground font-medium">
                  Bắt đầu cuộc trò chuyện
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hỏi bất cứ điều gì bạn muốn biết...
                </p>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-lg p-4 ${message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent border border-border"
                  }`}
              >
                {/* <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </div> */}
                <MarkdownRenderer>
                  {message.content}
                </MarkdownRenderer>
              </div>
            </div>
          ))}

          {/* Streaming Message */}
          {streamingContent && (
            <div className="flex justify-start">
              <div className="max-w-[85%] md:max-w-[75%] rounded-lg p-4 bg-accent border border-border">
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {streamingContent}
                </div>
                {!hasFirstChunk && <div className="flex items-center gap-1 mt-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && !streamingContent && (
            <div className="flex justify-start">
              <div className="bg-accent rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-muted-foreground text-sm">
                    Đang suy nghĩ...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mb-4">
            <Alert>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Lỗi</p>
                  <p className="text-xs mt-1 opacity-90">{error}</p>
                </div>
              </div>
            </Alert>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 ">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              disabled={isLoading}
              className="flex-1 focus:ring-0 focus:outline-0 focus:border-none"
            />

            {isLoading ? (
              <Button
                onClick={stopStreaming}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-5"
              >
                <span className="hidden sm:inline">Dừng</span>
                <span className="sm:hidden">●</span>
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-5"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}