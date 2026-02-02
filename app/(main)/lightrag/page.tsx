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
import DocumentPreviewSheet, {
  RetrievedChunk,
} from "./_components/DocumentPreviewSheet";
import ChatBlankState from "@/components/chat/ChatArea/Messages/ChatBlankState";
import { ReasoningBlock } from "./_components/ReasoningBlock";

type MessageType = {
  key: string;
  from: "user" | "assistant";
  sources?: any;
  versions: {
    id: string;
    content: string;
  }[];
  reasoning?: {
    content: string;
    isDone: boolean;
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
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [messages, setMessages] = useState<MessageType[]>([]);

  // --- Document Preview State ---
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{
    fileUrl: string;
    highlightAreas: any[];
    initialPage: number;
  } | null>(null);

  // Store highlights received from backend (map of fileUrl -> highlights)
  const [highlightsMap, setHighlightsMap] = useState<Record<string, any[]>>({});
  const [retrievedChunksMap, setRetrievedChunksMap] = useState<
    RetrievedChunk[]
  >([]);
  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);
  const LIGHTRAG_DIRECT_URL = "http://localhost:9621/query/stream";
  const FASTAPI_REF_URL = "http://127.0.0.1:8000/api/v1/basic-rag/references";
  /**
   * Handle opening the document preview with highlights.
   *
   * Flow:
   * 1. Get file URL from source
   * 2. Fetch highlights from highlightsMap (received from backend)
   * 3. Determine initial page from first highlight
   * 4. Open the preview sheet
   */
  const handleOpenPreview = (source: any) => {
    if (!source || !source.url) return;

    const fileUrl = source.url;

    // Get highlights for this file from the map
    const fileHighlights = highlightsMap[fileUrl] || [];

    // Determine initial page - use source.page if available, otherwise first highlight
    let firstPageIndex = 0;
    if (source.page && source.page > 0) {
      firstPageIndex = source.page - 1; // Convert 1-based to 0-based
    } else if (fileHighlights.length > 0) {
      firstPageIndex = fileHighlights[0].pageIndex;
    }

    console.log("📍 Opening preview with highlights:", {
      fileUrl,
      highlightCount: fileHighlights.length,
      firstPageIndex,
      sourcePage: source.page,
      highlights: fileHighlights,
    });

    setPreviewData({
      fileUrl,
      highlightAreas: fileHighlights,
      initialPage: firstPageIndex,
    });
    setPreviewOpen(true);
  };

  // --- Logic: Chat Request Updated (Direct Call) ---
  const handleChatRequest = async (userMessage: string) => {
    if (!userMessage.trim() || status === "streaming") return;

    setStatus("submitted");
    setText("");

    // 1. Setup UI (Optimistic Update)
    const userMsgEntry: MessageType = {
      key: nanoid(),
      from: "user",
      versions: [{ id: nanoid(), content: userMessage }],
    };

    const botMsgKey = nanoid();
    const botVersionId = nanoid();
    const botMsgEntry: MessageType = {
      key: botMsgKey,
      from: "assistant",
      versions: [{ id: botVersionId, content: "" }],
      sources: [],
    };

    setMessages((prev) => [...prev, userMsgEntry, botMsgEntry]);

    try {
      abortControllerRef.current = new AbortController();
      setStatus("streaming");
      const signal = abortControllerRef.current.signal;

      const requestBody = {
        query: userMessage,         // Quan trọng: LightRAG dùng 'query'
        mode: "mix",                // Chỉnh mode ở đây
        top_k: 3,
        chunk_top_k: 3,
        max_entity_tokens: 6000,
        max_relation_tokens: 8000,
        max_total_tokens: 30000,
        only_need_context: false,
        only_need_prompt: false,
        stream: true,               // Mặc định là true cho luồng chat
        history_turns: 3,
        user_prompt: "",
        // enable_rerank: true,
        response_type: "Multiple Paragraphs",
        conversation_history: []    // Nếu có history thì bỏ vào đây
      };

      // =========================================================
      // REQUEST A: STREAM TEXT (GỌI TRỰC TIẾP LIGHTRAG)
      // =========================================================
      // const streamPromise = fetch(LIGHTRAG_DIRECT_URL, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     query: userMessage,
      //     mode: "mix", // Hoặc "hybrid", "global"
      //     stream: true,
      //     include_references: false, // Ta lấy ref ở API kia rồi nên false cho nhẹ
      //     history_turns: 3, // Tùy chỉnh history
      //   }),
      //   signal,
      // }).then(async (response) => {
      //   if (!response.ok) {
      //     const errText = await response.text();
      //     throw new Error(`LightRAG Error: ${errText}`);
      //   }

      //   const reader = response.body?.getReader();
      //   const decoder = new TextDecoder();
      //   if (!reader) return;

      //   let accumulatedContent = "";

      //   while (true) {
      //     const { done, value } = await reader.read();
      //     if (done) break;

      //     const chunk = decoder.decode(value, { stream: true });
      //     // LightRAG trả về NDJSON (Newline Delimited JSON)
      //     const lines = chunk.split("\n");

      //     for (const line of lines) {
      //       const trimmedLine = line.trim();
      //       if (!trimmedLine) continue;

      //       try {
      //         // Parse trực tiếp JSON (Không cần check "data: ")
      //         const parsed = JSON.parse(trimmedLine);

      //         // 1. Handle Content Chunk (LightRAG key là "response")
      //         if (parsed.response) {
      //           accumulatedContent += parsed.response;

      //           setMessages((prev) =>
      //             prev.map((msg) =>
      //               msg.key === botMsgKey
      //                 ? {
      //                   ...msg,
      //                   versions: [
      //                     { ...msg.versions[0], content: accumulatedContent },
      //                   ],
      //                 }
      //                 : msg
      //             )
      //           );
      //         }

      //         // 2. Handle Error from LightRAG
      //         if (parsed.error) {
      //           console.error("LightRAG Stream Error:", parsed.error);
      //           toast.error(parsed.error);
      //         }
      //       } catch (e) {
      //         // Bỏ qua lỗi parse JSON với các dòng không hoàn chỉnh
      //       }
      //     }
      //   }
      // });
      // ... bên trong handleChatRequest

      // =========================================================
      // REQUEST A: STREAM TEXT (GỌI TRỰC TIẾP LIGHTRAG)
      // =========================================================
      const streamPromise = fetch(LIGHTRAG_DIRECT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody), // Dùng body chung
        signal,
      }).then(async (response) => {
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`LightRAG Error: ${errText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) return;

        let accumulatedRaw = ""; // Biến chứa toàn bộ raw text bao gồm cả thẻ tag

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            try {
              const parsed = JSON.parse(trimmedLine);

              if (parsed.response) {
                // 1. Tích lũy Raw Text
                accumulatedRaw += parsed.response;

                // 2. Logic Tách <think>...</think>
                let reasoningContent = "";
                let mainContent = "";
                let isThinkingDone = false;

                // Regex tìm thẻ think
                const thinkMatch = accumulatedRaw.match(/<think>([\s\S]*?)(?:<\/think>|$)/);

                if (thinkMatch) {
                  // Đang có thẻ think
                  reasoningContent = thinkMatch[1]; // Lấy nội dung bên trong

                  if (accumulatedRaw.includes("</think>")) {
                    // Đã đóng thẻ think -> Lấy phần text phía sau làm main content
                    isThinkingDone = true;
                    mainContent = accumulatedRaw.split("</think>")[1] || "";
                  } else {
                    // Chưa đóng thẻ think -> Main content rỗng
                    isThinkingDone = false;
                    mainContent = "";
                  }
                } else {
                  // Không có thẻ think -> Toàn bộ là main content
                  mainContent = accumulatedRaw;
                  isThinkingDone = true;
                }

                // 3. Update State
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.key === botMsgKey
                      ? {
                        ...msg,
                        // Cập nhật reasoning
                        reasoning: reasoningContent
                          ? {
                            content: reasoningContent,
                            isDone: isThinkingDone,
                          }
                          : undefined,
                        // Cập nhật nội dung chính
                        versions: [
                          { ...msg.versions[0], content: mainContent },
                        ],
                      }
                      : msg
                  )
                );
              }

              if (parsed.error) {
                toast.error(parsed.error);
              }
            } catch (e) {
              // Ignore json parse error
            }
          }
        }
      });
      // =========================================================
      // REQUEST B: GET REFERENCES (GỌI QUA FASTAPI CỦA BẠN)
      // =========================================================
      const refPromise = fetch(FASTAPI_REF_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Gửi cùng một body.
        // Backend sẽ tự động ép field "stream": false để xử lý logic lấy data.
        body: JSON.stringify(requestBody),
        signal,
      }).then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          // data format: { sources: [], highlights: {}, raw_chunks: [] }

          console.log("📑 References & Highlights Received:", data);

          // Update Global Highlights Map
          if (data.highlights) {
            setHighlightsMap((prev) => ({ ...prev, ...data.highlights }));
          }

          // Update Global Raw Chunks
          if (data.raw_chunks) {
            setRetrievedChunksMap(data.raw_chunks);
          }

          // Update Message Source Button
          if (data.sources && data.sources.length > 0) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.key === botMsgKey
                  ? { ...msg, sources: data.sources }
                  : msg
              )
            );
          }
        } else {
          console.error("Failed to fetch references from FastAPI");
        }
      });

      // Chạy song song cả 2 request
      await Promise.allSettled([streamPromise, refPromise]);

      setStatus("ready");
    } catch (err: any) {
      if (err.name !== "AbortError") {
        toast.error("Error: " + err.message);
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
      <DocumentPreviewSheet
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        fileUrl={previewData?.fileUrl}
        highlightAreas={previewData?.highlightAreas}
        retrievedChunks={retrievedChunksMap}
        initialPage={previewData?.initialPage}
        documentTitle={
          previewData?.fileUrl
            ? previewData.fileUrl.split("/").pop() || "Document"
            : "Document"
        }
      />

      <div className="relative flex h-[calc(100vh-3.5rem)] flex-col w-full max-w-5xl mx-auto overflow-hidden">
        {/* --- Conversation Area --- */}
        <Conversation>
          <ConversationContent>
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center space-y-4 p-8 text-muted-foreground">
                <ChatBlankState />
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
                        {/* === THÊM PHẦN NÀY: Reasoning Block (Chỉ hiện cho Assistant) === */}
                        {message.from === "assistant" && message.reasoning && (
                          <ReasoningBlock
                            content={message.reasoning.content}
                            isDone={message.reasoning.isDone}
                            isStreaming={status === "streaming"}
                          />
                        )}

                        {/* 1. Message Text Content */}
                        {/* Chỉ hiện Content khi nó có nội dung (để tránh một khoảng trắng lớn khi đang thinking) */}
                        {(version.content || (!message.reasoning && status === 'streaming')) && (
                          <MessageContent>
                            <MessageResponse>{version.content}</MessageResponse>
                          </MessageContent>
                        )}

                        {/* 2. Source Button (Assistant Only) */}
                        {message.from === "assistant" &&
                          message.sources &&
                          message.sources.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-dashed border-gray-200 dark:border-gray-800">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="h-8 text-xs font-normal gap-2 text-muted-foreground hover:text-primary transition-all"
                                onClick={() =>
                                  handleOpenPreview(message.sources![0])
                                }
                              >
                                <FileTextIcon className="w-3.5 h-3.5" />
                                Open document reference:{" "}
                                <span className="font-medium text-foreground">
                                  {message.sources[0].source}
                                </span>
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
