
"use client";

import {
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
} from "@/components/ai-elements/message";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { ToolUIPart } from "ai";
import { StopCircle, FileTextIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DocumentPreviewSheet, type HighlightArea } from "./_components/DocumentPreviewSheet";

// --- Types Definition ---

/**
 * Source data returned from backend with highlight information.
 * Backend returns highlights as array of HighlightArea objects.
 */
type SourceData = {
  id: string;
  source: string;                    // Filename (e.g., "document.pdf")
  url: string;                       // Full URL to static file
  page: number;                      // 1-based page number
  content: { text: string };         // Text content of the chunk
  highlights: HighlightArea[];       // Array of highlight areas from backend
};

type MessageType = {
  key: string;
  from: "user" | "assistant";
  sources?: SourceData[];
  versions: {
    id: string;
    content: string;
  }[];
  reasoning?: {
    content: string;
    duration: number;
  };
  tools?: {
    name: string;
    description: string;
    status: ToolUIPart["state"];
    parameters: Record<string, unknown>;
    result: string | undefined;
    error: string | undefined;
  }[];
};

const suggestions = [
  "Quy định làm việc tại nhà như thế nào?",
  "Chế độ nghỉ phép của công ty ra sao?",
  "Mức đóng bảo hiểm xã hội là bao nhiêu?",
];

export default function ChatPage() {
  // --- State ---
  const [text, setText] = useState<string>("");
  const [status, setStatus] = useState<"submitted" | "streaming" | "ready" | "error">("ready");
  const [messages, setMessages] = useState<MessageType[]>([]);

  // --- Document Preview State ---
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{
    fileUrl: string;
    highlightAreas: HighlightArea[];
    initialPage: number;
  } | null>(null);

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Handle opening the document preview with highlights.
   * 
   * Flow:
   * 1. Get all sources for the target file
   * 2. Collect all highlight areas from those sources
   * 3. Determine initial page from first highlight
   * 4. Open the preview sheet
   */
  const handleOpenPreview = (sources: SourceData[]) => {
    if (!sources || sources.length === 0) return;

    // Get the first source's file info
    const targetFile = sources[0].source;
    const fileUrl = sources[0].url || `/static/${targetFile}`;

    // Collect all highlight areas from all sources of this file
    const allHighlights: HighlightArea[] = [];
    let firstPageIndex = 0;

    sources
      .filter((s) => s.source === targetFile)
      .forEach((source) => {
        if (source.highlights && Array.isArray(source.highlights)) {
          allHighlights.push(...source.highlights);

          // Get first page index for initial scroll
          if (source.highlights.length > 0 && firstPageIndex === 0) {
            firstPageIndex = source.highlights[0].pageIndex;
          }
        }
      });

    console.log('📍 Opening preview with highlights:', {
      fileUrl,
      highlightCount: allHighlights.length,
      firstPageIndex,
      highlights: allHighlights
    });

    setPreviewData({
      fileUrl,
      highlightAreas: allHighlights,
      initialPage: firstPageIndex,
    });
    setPreviewOpen(true);
  };

  // --- Logic: Chat Request ---
  const handleChatRequest = async (userMessage: string) => {
    if (!userMessage.trim() || status === "streaming") return;

    setStatus("submitted");
    setText("");

    // 1. Create User Message
    const userMsgEntry: MessageType = {
      key: nanoid(),
      from: "user",
      versions: [{ id: nanoid(), content: userMessage }],
    };

    // 2. Create Assistant Message Placeholder
    const botMsgKey = nanoid();
    const botVersionId = nanoid();
    const botMsgEntry: MessageType = {
      key: botMsgKey,
      from: "assistant",
      versions: [{ id: botVersionId, content: "" }],
    };

    setMessages((prev) => [...prev, userMsgEntry, botMsgEntry]);

    try {
      abortControllerRef.current = new AbortController();
      setStatus("streaming");

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/basic-rag/chat-stream",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userMessage }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("Response body is null");

      let accumulatedContent = "";
      let accumulatedSources: SourceData[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              setStatus("ready");
              return;
            }

            try {
              const parsed = JSON.parse(data);

              // --- CASE 1: Handle Content Stream ---
              // Backend Format: {"content": {"content": "text...", ...}}
              if (parsed.content && parsed.content.content) {
                accumulatedContent += parsed.content.content;

                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.key === botMsgKey) {
                      return {
                        ...msg,
                        versions: msg.versions.map((v) =>
                          v.id === botVersionId
                            ? { ...v, content: accumulatedContent }
                            : v
                        ),
                      };
                    }
                    return msg;
                  })
                );
              }

              // --- CASE 2: Handle Sources ---
              // Backend Format: {"sources": [{"source": "...", "content": "..."}, ...]}
              if (parsed.sources) {
                accumulatedSources = parsed.sources;

                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.key === botMsgKey) {
                      return {
                        ...msg,
                        sources: accumulatedSources, // Attach full source objects
                      };
                    }
                    return msg;
                  })
                );
              }

            } catch (parseError) {
              // Ignore non-json lines or keepalive chunks
            }
          }
        }
      }
      setStatus("ready");
    } catch (err: any) {
      if (err.name === "AbortError") {
        toast.info("Đã dừng phản hồi");
      } else {
        toast.error("Lỗi: " + (err.message || "Unknown error"));
        setStatus("error");
      }
    } finally {
      abortControllerRef.current = null;
      if (status !== "error") setStatus("ready");
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setStatus("ready");
    }
  };

  const handleSubmit = (message: PromptInputMessage) => {
    if (message.text) handleChatRequest(message.text);
  };

  return (
    <div className="h-full relative">
      {/* --- Document Preview Sheet Component --- */}
      {previewData && (
        <DocumentPreviewSheet
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          fileUrl={previewData.fileUrl}
          highlightAreas={previewData.highlightAreas}
          initialPage={previewData.initialPage}
        />
      )}

      <div className="relative flex h-[calc(100vh-3.5rem)] flex-col w-full max-w-5xl mx-auto overflow-hidden">
        {/* --- Conversation Area --- */}
        <Conversation>
          <ConversationContent>
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center space-y-4 p-8 text-muted-foreground">
                <p className="text-lg font-medium">Chat với Tài liệu Sphinx</p>
              </div>
            )}

            {messages.map(({ versions, ...message }) => (
              <MessageBranch defaultBranch={0} key={message.key}>
                <MessageBranchContent>
                  {versions.map((version) => (
                    <Message
                      from={message.from}
                      key={`${message.key}-${version.id}`}
                    >
                      <div className="flex flex-col w-full">
                        {/* 1. Message Text Content */}
                        <MessageContent>
                          <MessageResponse>{version.content}</MessageResponse>
                        </MessageContent>

                        {/* 2. Source Button (Assistant Only) */}
                        {message.from === "assistant" && message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-dashed border-gray-200 dark:border-gray-800">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-8 text-xs font-normal gap-2 text-muted-foreground hover:text-primary transition-all"
                              onClick={() => handleOpenPreview(message.sources!)}
                            >
                              <FileTextIcon className="w-3.5 h-3.5" />
                              Mở tài liệu tham chiếu: <span className="font-medium text-foreground">{message.sources[0].source}</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </Message>
                  ))}
                </MessageBranchContent>

                {versions.length > 1 && (
                  <MessageBranchSelector from={message.from}>
                    <MessageBranchPrevious />
                    <MessageBranchPage />
                    <MessageBranchNext />
                  </MessageBranchSelector>
                )}
              </MessageBranch>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* --- Input Area --- */}
        <div className="grid shrink-0 gap-4 pt-4 pb-4">
          {messages.length === 0 && (
            <div className="flex gap-2 justify-center px-4 flex-wrap">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleChatRequest(suggestion)}
                  className="text-xs bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-full transition-colors text-muted-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div className="w-full px-4">
            <PromptInput
              globalDrop
              multiple
              onSubmit={handleSubmit}
              className="w-full"
            >
              <PromptInputHeader>
                <PromptInputAttachments>
                  {(attachment) => <PromptInputAttachment data={attachment} />}
                </PromptInputAttachments>
              </PromptInputHeader>
              <PromptInputBody>
                <PromptInputTextarea
                  onChange={(event) => setText(event.target.value)}
                  value={text}
                  placeholder="Hỏi về quy định công ty..."
                  disabled={status === "streaming"}
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                </PromptInputTools>

                {status === "streaming" ? (
                  <button
                    onClick={stopStreaming}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <StopCircle className="size-5" />
                  </button>
                ) : (
                  <PromptInputSubmit
                    disabled={!text.trim() || status === "submitted"}
                    status={status}
                  />
                )}
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}