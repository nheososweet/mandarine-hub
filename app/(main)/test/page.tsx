// "use client";

// import React, { useState, useRef } from "react";
// import { Send, RefreshCcw, Copy, StopCircle } from "lucide-react";
// import {
//   Conversation,
//   ConversationContent,
//   ConversationScrollButton,
// } from "@/components/ai-elements/conversation";
// import {
//   Message,
//   MessageContent,
//   MessageResponse,
//   MessageActions,
//   MessageAction,
// } from "@/components/ai-elements/message";
// import {
//   PromptInput,
//   PromptInputBody,
//   PromptInputFooter,
//   PromptInputSubmit,
//   PromptInputTextarea,
//   PromptInputTools,
//   type PromptInputMessage,
// } from "@/components/ai-elements/prompt-input";
// import { Loader } from "@/components/ai-elements/loader";

// // Message type
// interface ChatMessage {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
// }

// export default function ChatPage() {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [streamingContent, setStreamingContent] = useState("");

//   const abortControllerRef = useRef<AbortController | null>(null);

//   const handleSubmit = async (message: PromptInputMessage) => {
//     const userMessage = message.text?.trim();
//     if (!userMessage || isLoading) return;

//     setInput("");
//     setError(null);
//     setIsLoading(true);
//     setStreamingContent("");

//     const newUserMessage: ChatMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       content: userMessage,
//     };

//     setMessages((prev) => [...prev, newUserMessage]);

//     try {
//       abortControllerRef.current = new AbortController();

//       const response = await fetch(
//         "http://127.0.0.1:8000/api/v1/rag/chat-stream",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ question: userMessage }),
//           signal: abortControllerRef.current.signal,
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const reader = response.body?.getReader();
//       const decoder = new TextDecoder();

//       if (!reader) {
//         throw new Error("Response body is null");
//       }

//       let accumulatedContent = "";

//       while (true) {
//         const { done, value } = await reader.read();

//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         const lines = chunk.split("\n");

//         for (const line of lines) {
//           if (line.startsWith("data: ")) {
//             const data = line.slice(6).trim();

//             if (data === "[DONE]") {
//               setMessages((prev) => [
//                 ...prev,
//                 {
//                   id: Date.now().toString(),
//                   role: "assistant",
//                   content: accumulatedContent,
//                 },
//               ]);
//               setStreamingContent("");
//               setIsLoading(false);
//               return;
//             }

//             try {
//               const parsed = JSON.parse(data);

//               if (parsed.content) {
//                 accumulatedContent += parsed.content;
//                 setStreamingContent(accumulatedContent);
//               }
//             } catch (parseError) {
//               console.warn("Failed to parse chunk:", data);
//             }
//           }
//         }
//       }

//       if (accumulatedContent) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: Date.now().toString(),
//             role: "assistant",
//             content: accumulatedContent,
//           },
//         ]);
//         setStreamingContent("");
//       }
//     } catch (err: any) {
//       if (err.name === "AbortError") {
//         setError("Yêu cầu đã bị hủy");
//       } else {
//         setError(err.message || "Không thể gửi tin nhắn");
//       }
//       console.error("Chat error:", err);
//     } finally {
//       setIsLoading(false);
//       abortControllerRef.current = null;
//     }
//   };

//   const stopStreaming = () => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//       setIsLoading(false);
//     }
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//   };

//   const regenerateLastMessage = async () => {
//     if (messages.length < 2) return;

//     const lastUserMessage = [...messages]
//       .reverse()
//       .find((m) => m.role === "user");
//     if (!lastUserMessage) return;

//     setMessages((prev) => prev.slice(0, -1));

//     handleSubmit({ text: lastUserMessage.content, files: [] });
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 relative size-full h-full">
//       <div className="flex flex-col h-full">
//         <Conversation className="h-full">
//           <ConversationContent>
//             {messages.length === 0 && (
//               <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
//                 <div className="p-4 bg-muted rounded-xl">
//                   <Send className="w-8 h-8 text-muted-foreground" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">Bắt đầu cuộc trò chuyện</p>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Hỏi bất cứ điều gì bạn muốn biết...
//                   </p>
//                 </div>
//               </div>
//             )}

//             {messages.map((message, index) => (
//               <Message key={message.id} from={message.role}>
//                 <MessageContent>
//                   <MessageResponse>{message.content}</MessageResponse>
//                 </MessageContent>
//                 {message.role === "assistant" &&
//                   index === messages.length - 1 &&
//                   !isLoading && (
//                     <MessageActions>
//                       <MessageAction
//                         onClick={regenerateLastMessage}
//                         label="Thử lại"
//                       >
//                         <RefreshCcw className="size-3" />
//                       </MessageAction>
//                       <MessageAction
//                         onClick={() => copyToClipboard(message.content)}
//                         label="Sao chép"
//                       >
//                         <Copy className="size-3" />
//                       </MessageAction>
//                     </MessageActions>
//                   )}
//               </Message>
//             ))}

//             {streamingContent && (
//               <Message from="assistant">
//                 <MessageContent>
//                   <MessageResponse>{streamingContent}</MessageResponse>
//                 </MessageContent>
//               </Message>
//             )}

//             {isLoading && !streamingContent && <Loader />}

//             {error && (
//               <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
//                 <p className="font-medium">Lỗi</p>
//                 <p className="text-xs mt-1 opacity-90">{error}</p>
//               </div>
//             )}
//           </ConversationContent>
//           <ConversationScrollButton />
//         </Conversation>

//         <PromptInput onSubmit={handleSubmit} className="mt-4">
//           <PromptInputBody>
//             <PromptInputTextarea
//               onChange={(e) => setInput(e.target.value)}
//               value={input}
//               placeholder="Nhập câu hỏi của bạn..."
//               disabled={isLoading}
//             />
//           </PromptInputBody>
//           <PromptInputFooter>
//             <PromptInputTools>
//               {isLoading && (
//                 <button
//                   onClick={stopStreaming}
//                   className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
//                 >
//                   <StopCircle className="size-4" />
//                   <span>Dừng</span>
//                 </button>
//               )}
//             </PromptInputTools>
//             <PromptInputSubmit
//               disabled={!input.trim() && !isLoading}
//               status={isLoading ? "streaming" : "ready"}
//             />
//           </PromptInputFooter>
//         </PromptInput>
//       </div>
//     </div>
//   );
// }

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
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import type { ToolUIPart } from "ai"; // Lưu ý: Cần cài ai sdk hoặc thay bằng type tự định nghĩa
import { CheckIcon, GlobeIcon, MicIcon, StopCircle } from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// --- Types Definition (Giữ nguyên cấu trúc của Code mới) ---
type MessageType = {
  key: string;
  from: "user" | "assistant";
  sources?: { href: string; title: string }[];
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

// --- Dummy Data ---
const models = [
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    chef: "Google",
    chefSlug: "google",
    providers: ["google"],
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai"],
  },
];

const suggestions = [
  "Tóm tắt tài liệu này",
  "Giải thích khái niệm RAG",
  "Viết code React hook cơ bản",
  "So sánh SQL và NoSQL",
];

export default function ChatPage() {
  // --- State ---
  const [model, setModel] = useState<string>(models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [text, setText] = useState<string>("");
  // Status: submitted (đang gửi), streaming (đang nhận), ready (sẵn sàng), error (lỗi)
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [messages, setMessages] = useState<MessageType[]>([]);

  // Refs để xử lý stream và abort
  const abortControllerRef = useRef<AbortController | null>(null);

  const selectedModelData = models.find((m) => m.id === model);

  // --- Logic xử lý Chat (Tích hợp code cũ) ---
  const handleChatRequest = async (userMessage: string) => {
    if (!userMessage.trim() || status === "streaming") return;

    setStatus("submitted");
    setText(""); // Clear input ngay khi gửi

    // 1. Tạo Message User
    const userMsgEntry: MessageType = {
      key: nanoid(),
      from: "user",
      versions: [{ id: nanoid(), content: userMessage }],
    };

    // 2. Tạo Message Assistant (Placeholder rỗng để hứng stream)
    const botMsgKey = nanoid();
    const botVersionId = nanoid();
    const botMsgEntry: MessageType = {
      key: botMsgKey,
      from: "assistant",
      versions: [{ id: botVersionId, content: "" }],
    };

    // Cập nhật UI ban đầu
    setMessages((prev) => [...prev, userMsgEntry, botMsgEntry]);

    try {
      abortControllerRef.current = new AbortController();
      setStatus("streaming");

      // Gọi API thực tế
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/rag/chat-stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userMessage,
            model: model, // Gửi kèm model nếu backend hỗ trợ
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("Response body is null");

      let accumulatedContent = "";

      // Vòng lặp đọc stream
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

              // Logic map dữ liệu từ backend cũ vào structure mới
              if (parsed.content) {
                accumulatedContent += parsed.content;

                // Cập nhật state messages
                setMessages((prev) =>
                  prev.map((msg) => {
                    // Tìm đúng message assistant đang stream
                    if (msg.key === botMsgKey) {
                      return {
                        ...msg,
                        versions: msg.versions.map((v) =>
                          // Cập nhật phiên bản version hiện tại
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
            } catch (parseError) {
              console.warn("Failed to parse chunk:", data);
            }
          }
        }
      }
      setStatus("ready");
    } catch (err: any) {
      if (err.name === "AbortError") {
        toast.info("Đã dừng phản hồi");
      } else {
        toast.error("Có lỗi xảy ra: " + (err.message || "Unknown error"));
        // Cập nhật message lỗi vào UI nếu cần
      }
      setStatus("error");
      console.error("Chat error:", err);
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
    if (message.text) {
      handleChatRequest(message.text);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleChatRequest(suggestion);
  };

  return (
    <div className="h-full">
      <div className="relative flex h-[calc(100vh-3.5rem)] flex-col w-full max-w-5xl mx-auto overflow-hidden">
        {/* --- Conversation Area --- */}
        <Conversation>
          <ConversationContent>
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center space-y-4 p-8 text-muted-foreground">
                <p className="text-lg font-medium">Bắt đầu trò chuyện với AI</p>
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
                      <div>
                        {/* Render Sources nếu có (Hiện tại Backend chưa trả về, nhưng để sẵn UI) */}
                        {message.sources?.length && (
                          <Sources>
                            <SourcesTrigger count={message.sources.length} />
                            <SourcesContent>
                              {message.sources.map((source) => (
                                <Source
                                  href={source.href}
                                  key={source.href}
                                  title={source.title}
                                />
                              ))}
                            </SourcesContent>
                          </Sources>
                        )}

                        {/* Render Reasoning nếu có */}
                        {message.reasoning && (
                          <Reasoning duration={message.reasoning.duration}>
                            <ReasoningTrigger />
                            <ReasoningContent>
                              {message.reasoning.content}
                            </ReasoningContent>
                          </Reasoning>
                        )}

                        {/* Nội dung chính */}
                        <MessageContent>
                          <MessageResponse>{version.content}</MessageResponse>
                        </MessageContent>
                      </div>
                    </Message>
                  ))}
                </MessageBranchContent>
                {/* Selector cho các phiên bản câu trả lời (nếu sau này thêm tính năng regenerate) */}
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
          {/* Chỉ hiện suggestions khi chưa có tin nhắn nào */}
          {messages.length === 0 && (
            <Suggestions className="px-4">
              {suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  suggestion={suggestion}
                />
              ))}
            </Suggestions>
          )}

          <div className="w-full px-4">
            <PromptInput
              globalDrop
              multiple
              onSubmit={handleSubmit}
              className="w-full" // Căn giữa input cho đẹp
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
                  placeholder="Nhập câu hỏi của bạn..."
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

                  {/* Nút Model Selector (Chỉ mang tính chất UI trừ khi backend hỗ trợ switch model) */}
                  <ModelSelector
                    onOpenChange={setModelSelectorOpen}
                    open={modelSelectorOpen}
                  >
                    <ModelSelectorTrigger asChild>
                      <PromptInputButton>
                        {selectedModelData?.chefSlug && (
                          <ModelSelectorLogo
                            provider={selectedModelData.chefSlug}
                          />
                        )}
                        {selectedModelData?.name && (
                          <ModelSelectorName>
                            {selectedModelData.name}
                          </ModelSelectorName>
                        )}
                      </PromptInputButton>
                    </ModelSelectorTrigger>
                    <ModelSelectorContent>
                      <ModelSelectorInput placeholder="Search models..." />
                      <ModelSelectorList>
                        <ModelSelectorEmpty>
                          No models found.
                        </ModelSelectorEmpty>
                        {["OpenAI", "Google"].map((chef) => (
                          <ModelSelectorGroup key={chef} heading={chef}>
                            {models
                              .filter((m) => m.chef === chef)
                              .map((m) => (
                                <ModelSelectorItem
                                  key={m.id}
                                  onSelect={() => {
                                    setModel(m.id);
                                    setModelSelectorOpen(false);
                                  }}
                                  value={m.id}
                                >
                                  <ModelSelectorLogo provider={m.chefSlug} />
                                  <ModelSelectorName>
                                    {m.name}
                                  </ModelSelectorName>
                                  {model === m.id ? (
                                    <CheckIcon className="ml-auto size-4" />
                                  ) : (
                                    <div className="ml-auto size-4" />
                                  )}
                                </ModelSelectorItem>
                              ))}
                          </ModelSelectorGroup>
                        ))}
                      </ModelSelectorList>
                    </ModelSelectorContent>
                  </ModelSelector>
                </PromptInputTools>

                {/* Nút Submit hoặc Stop */}
                {status === "streaming" ? (
                  <button
                    onClick={stopStreaming}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
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
