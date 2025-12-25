"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, AlertCircle } from "lucide-react";
import MarkdownRenderer from "@/components/ui/typography/MarkdownRenderer";

// Shadcn UI Components (inline for artifact)
const Button = ({
  children,
  className = "",
  disabled = false,
  onClick,
  ...props
}) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const Alert = ({ children, className = "" }) => (
  <div
    className={`relative w-full rounded-lg border border-red-200 bg-red-50 p-4 text-red-900 ${className}`}
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    setIsLoading(true);
    setStreamingContent("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      // Create abort controller
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

            if (data === "[DONE]") {
              // Finalize message
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

              // Extract content from LangChain format
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

      // If loop exits without [DONE]
      if (accumulatedContent) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: accumulatedContent },
        ]);
        setStreamingContent("");
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Request was cancelled");
      } else {
        setError(err.message || "Failed to send message");
      }
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
    <div className="flex h-screen bg-gradient-to-br from-violet-500 to-purple-600 p-4">
      <Card className="flex flex-col w-full max-w-4xl mx-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">RAG Chat Assistant</h1>
          <p className="text-center text-violet-100 text-sm mt-1">
            Powered by LangChain & Gemini
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                    : "bg-white text-gray-900 shadow-md border border-gray-200"
                }`}
              >
                {/* <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div> */}
                <MarkdownRenderer>{message.content}</MarkdownRenderer>
              </div>
            </div>
          ))}

          {/* Streaming Message */}
          {streamingContent && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-white text-gray-900 shadow-md border border-gray-200">
                <div className="whitespace-pre-wrap break-words">
                  {streamingContent}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && !streamingContent && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-200">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                  <span className="text-gray-600 text-sm">
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
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </Alert>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-200 rounded-b-lg">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              disabled={isLoading}
              className="flex-1"
            />

            {isLoading ? (
              <Button
                onClick={stopStreaming}
                className="bg-red-600 hover:bg-red-700 text-white px-6"
              >
                Dừng
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
