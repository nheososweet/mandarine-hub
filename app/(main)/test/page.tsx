// "use client";

// import {
//   MessageBranch,
//   MessageBranchContent,
//   MessageBranchNext,
//   MessageBranchPage,
//   MessageBranchPrevious,
//   MessageBranchSelector,
// } from "@/components/ai-elements/message";
// import {
//   Conversation,
//   ConversationContent,
//   ConversationScrollButton,
// } from "@/components/ai-elements/conversation";
// import {
//   Message,
//   MessageContent,
//   MessageResponse,
// } from "@/components/ai-elements/message";
// import {
//   PromptInput,
//   PromptInputActionAddAttachments,
//   PromptInputActionMenu,
//   PromptInputActionMenuContent,
//   PromptInputActionMenuTrigger,
//   PromptInputAttachment,
//   PromptInputAttachments,
//   PromptInputBody,
//   PromptInputButton,
//   PromptInputFooter,
//   PromptInputHeader,
//   type PromptInputMessage,
//   PromptInputSubmit,
//   PromptInputTextarea,
//   PromptInputTools,
// } from "@/components/ai-elements/prompt-input";
// import {
//   ModelSelector,
//   ModelSelectorContent,
//   ModelSelectorEmpty,
//   ModelSelectorGroup,
//   ModelSelectorInput,
//   ModelSelectorItem,
//   ModelSelectorList,
//   ModelSelectorLogo,
//   ModelSelectorLogoGroup,
//   ModelSelectorName,
//   ModelSelectorTrigger,
// } from "@/components/ai-elements/model-selector";
// import {
//   Reasoning,
//   ReasoningContent,
//   ReasoningTrigger,
// } from "@/components/ai-elements/reasoning";
// import {
//   Source,
//   Sources,
//   SourcesContent,
//   SourcesTrigger,
// } from "@/components/ai-elements/sources";
// import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
// import type { ToolUIPart } from "ai"; // Lưu ý: Cần cài ai sdk hoặc thay bằng type tự định nghĩa
// import { CheckIcon, GlobeIcon, MicIcon, StopCircle } from "lucide-react";
// import { nanoid } from "nanoid";
// import { useCallback, useRef, useState } from "react";
// import { toast } from "sonner";

// // --- Types Definition (Giữ nguyên cấu trúc của Code mới) ---
// type MessageType = {
//   key: string;
//   from: "user" | "assistant";
//   sources?: { href: string; title: string }[];
//   versions: {
//     id: string;
//     content: string;
//   }[];
//   reasoning?: {
//     content: string;
//     duration: number;
//   };
//   tools?: {
//     name: string;
//     description: string;
//     status: ToolUIPart["state"];
//     parameters: Record<string, unknown>;
//     result: string | undefined;
//     error: string | undefined;
//   }[];
// };

// // --- Dummy Data ---
// const models = [
//   {
//     id: "gemini-2.0-flash-exp",
//     name: "Gemini 2.0 Flash",
//     chef: "Google",
//     chefSlug: "google",
//     providers: ["google"],
//   },
//   {
//     id: "gpt-4o",
//     name: "GPT-4o",
//     chef: "OpenAI",
//     chefSlug: "openai",
//     providers: ["openai"],
//   },
// ];

// const suggestions = [
//   "Tóm tắt tài liệu này",
//   "Giải thích khái niệm RAG",
//   "Viết code React hook cơ bản",
//   "So sánh SQL và NoSQL",
// ];

// export default function ChatPage() {
//   // --- State ---
//   const [model, setModel] = useState<string>(models[0].id);
//   const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
//   const [text, setText] = useState<string>("");
//   // Status: submitted (đang gửi), streaming (đang nhận), ready (sẵn sàng), error (lỗi)
//   const [status, setStatus] = useState<
//     "submitted" | "streaming" | "ready" | "error"
//   >("ready");
//   const [messages, setMessages] = useState<MessageType[]>([]);

//   // Refs để xử lý stream và abort
//   const abortControllerRef = useRef<AbortController | null>(null);

//   const selectedModelData = models.find((m) => m.id === model);

//   // --- Logic xử lý Chat (Tích hợp code cũ) ---
//   const handleChatRequest = async (userMessage: string) => {
//     if (!userMessage.trim() || status === "streaming") return;

//     setStatus("submitted");
//     setText(""); // Clear input ngay khi gửi

//     // 1. Tạo Message User
//     const userMsgEntry: MessageType = {
//       key: nanoid(),
//       from: "user",
//       versions: [{ id: nanoid(), content: userMessage }],
//     };

//     // 2. Tạo Message Assistant (Placeholder rỗng để hứng stream)
//     const botMsgKey = nanoid();
//     const botVersionId = nanoid();
//     const botMsgEntry: MessageType = {
//       key: botMsgKey,
//       from: "assistant",
//       versions: [{ id: botVersionId, content: "" }],
//     };

//     // Cập nhật UI ban đầu
//     setMessages((prev) => [...prev, userMsgEntry, botMsgEntry]);

//     try {
//       abortControllerRef.current = new AbortController();
//       setStatus("streaming");

//       // Gọi API thực tế
//       const response = await fetch(
//         "http://127.0.0.1:8000/api/v1/rag/chat-stream",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             question: userMessage,
//             model: model, // Gửi kèm model nếu backend hỗ trợ
//           }),
//           signal: abortControllerRef.current.signal,
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const reader = response.body?.getReader();
//       const decoder = new TextDecoder();

//       if (!reader) throw new Error("Response body is null");

//       let accumulatedContent = "";

//       // Vòng lặp đọc stream
//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         const chunk = decoder.decode(value, { stream: true });
//         const lines = chunk.split("\n");

//         for (const line of lines) {
//           if (line.startsWith("data: ")) {
//             const data = line.slice(6).trim();

//             if (data === "[DONE]") {
//               setStatus("ready");
//               return;
//             }

//             try {
//               const parsed = JSON.parse(data);

//               // Logic map dữ liệu từ backend cũ vào structure mới
//               if (parsed.content) {
//                 accumulatedContent += parsed.content;

//                 // Cập nhật state messages
//                 setMessages((prev) =>
//                   prev.map((msg) => {
//                     // Tìm đúng message assistant đang stream
//                     if (msg.key === botMsgKey) {
//                       return {
//                         ...msg,
//                         versions: msg.versions.map((v) =>
//                           // Cập nhật phiên bản version hiện tại
//                           v.id === botVersionId
//                             ? { ...v, content: accumulatedContent }
//                             : v
//                         ),
//                       };
//                     }
//                     return msg;
//                   })
//                 );
//               }
//             } catch (parseError) {
//               console.warn("Failed to parse chunk:", data);
//             }
//           }
//         }
//       }
//       setStatus("ready");
//     } catch (err: any) {
//       if (err.name === "AbortError") {
//         toast.info("Đã dừng phản hồi");
//       } else {
//         toast.error("Có lỗi xảy ra: " + (err.message || "Unknown error"));
//         // Cập nhật message lỗi vào UI nếu cần
//       }
//       setStatus("error");
//       console.error("Chat error:", err);
//     } finally {
//       abortControllerRef.current = null;
//       if (status !== "error") setStatus("ready");
//     }
//   };

//   const stopStreaming = () => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//       setStatus("ready");
//     }
//   };

//   const handleSubmit = (message: PromptInputMessage) => {
//     if (message.text) {
//       handleChatRequest(message.text);
//     }
//   };

//   const handleSuggestionClick = (suggestion: string) => {
//     handleChatRequest(suggestion);
//   };

//   return (
//     <div className="h-full">
//       <div className="relative flex h-[calc(100vh-3.5rem)] flex-col w-full max-w-5xl mx-auto overflow-hidden">
//         {/* --- Conversation Area --- */}
//         <Conversation>
//           <ConversationContent>
//             {messages.length === 0 && (
//               <div className="flex h-full flex-col items-center justify-center space-y-4 p-8 text-muted-foreground">
//                 <p className="text-lg font-medium">Bắt đầu trò chuyện với AI</p>
//               </div>
//             )}

//             {messages.map(({ versions, ...message }) => (
//               <MessageBranch defaultBranch={0} key={message.key}>
//                 <MessageBranchContent>
//                   {versions.map((version) => (
//                     <Message
//                       from={message.from}
//                       key={`${message.key}-${version.id}`}
//                     >
//                       <div>
//                         {/* Render Sources nếu có (Hiện tại Backend chưa trả về, nhưng để sẵn UI) */}
//                         {message.sources?.length && (
//                           <Sources>
//                             <SourcesTrigger count={message.sources.length} />
//                             <SourcesContent>
//                               {message.sources.map((source) => (
//                                 <Source
//                                   href={source.href}
//                                   key={source.href}
//                                   title={source.title}
//                                 />
//                               ))}
//                             </SourcesContent>
//                           </Sources>
//                         )}

//                         {/* Render Reasoning nếu có */}
//                         {message.reasoning && (
//                           <Reasoning duration={message.reasoning.duration}>
//                             <ReasoningTrigger />
//                             <ReasoningContent>
//                               {message.reasoning.content}
//                             </ReasoningContent>
//                           </Reasoning>
//                         )}

//                         {/* Nội dung chính */}
//                         <MessageContent>
//                           <MessageResponse>{version.content}</MessageResponse>
//                         </MessageContent>
//                       </div>
//                     </Message>
//                   ))}
//                 </MessageBranchContent>
//                 {/* Selector cho các phiên bản câu trả lời (nếu sau này thêm tính năng regenerate) */}
//                 {versions.length > 1 && (
//                   <MessageBranchSelector from={message.from}>
//                     <MessageBranchPrevious />
//                     <MessageBranchPage />
//                     <MessageBranchNext />
//                   </MessageBranchSelector>
//                 )}
//               </MessageBranch>
//             ))}
//           </ConversationContent>
//           <ConversationScrollButton />
//         </Conversation>

//         {/* --- Input Area --- */}
//         <div className="grid shrink-0 gap-4 pt-4 pb-4">
//           {/* Chỉ hiện suggestions khi chưa có tin nhắn nào */}
//           {messages.length === 0 && (
//             <Suggestions className="px-4">
//               {suggestions.map((suggestion) => (
//                 <Suggestion
//                   key={suggestion}
//                   onClick={() => handleSuggestionClick(suggestion)}
//                   suggestion={suggestion}
//                 />
//               ))}
//             </Suggestions>
//           )}

//           <div className="w-full px-4">
//             <PromptInput
//               globalDrop
//               multiple
//               onSubmit={handleSubmit}
//               className="w-full" // Căn giữa input cho đẹp
//             >
//               <PromptInputHeader>
//                 <PromptInputAttachments>
//                   {(attachment) => <PromptInputAttachment data={attachment} />}
//                 </PromptInputAttachments>
//               </PromptInputHeader>
//               <PromptInputBody>
//                 <PromptInputTextarea
//                   onChange={(event) => setText(event.target.value)}
//                   value={text}
//                   placeholder="Nhập câu hỏi của bạn..."
//                   disabled={status === "streaming"}
//                 />
//               </PromptInputBody>
//               <PromptInputFooter>
//                 <PromptInputTools>
//                   <PromptInputActionMenu>
//                     <PromptInputActionMenuTrigger />
//                     <PromptInputActionMenuContent>
//                       <PromptInputActionAddAttachments />
//                     </PromptInputActionMenuContent>
//                   </PromptInputActionMenu>

//                   {/* Nút Model Selector (Chỉ mang tính chất UI trừ khi backend hỗ trợ switch model) */}
//                   <ModelSelector
//                     onOpenChange={setModelSelectorOpen}
//                     open={modelSelectorOpen}
//                   >
//                     <ModelSelectorTrigger asChild>
//                       <PromptInputButton>
//                         {selectedModelData?.chefSlug && (
//                           <ModelSelectorLogo
//                             provider={selectedModelData.chefSlug}
//                           />
//                         )}
//                         {selectedModelData?.name && (
//                           <ModelSelectorName>
//                             {selectedModelData.name}
//                           </ModelSelectorName>
//                         )}
//                       </PromptInputButton>
//                     </ModelSelectorTrigger>
//                     <ModelSelectorContent>
//                       <ModelSelectorInput placeholder="Search models..." />
//                       <ModelSelectorList>
//                         <ModelSelectorEmpty>
//                           No models found.
//                         </ModelSelectorEmpty>
//                         {["OpenAI", "Google"].map((chef) => (
//                           <ModelSelectorGroup key={chef} heading={chef}>
//                             {models
//                               .filter((m) => m.chef === chef)
//                               .map((m) => (
//                                 <ModelSelectorItem
//                                   key={m.id}
//                                   onSelect={() => {
//                                     setModel(m.id);
//                                     setModelSelectorOpen(false);
//                                   }}
//                                   value={m.id}
//                                 >
//                                   <ModelSelectorLogo provider={m.chefSlug} />
//                                   <ModelSelectorName>
//                                     {m.name}
//                                   </ModelSelectorName>
//                                   {model === m.id ? (
//                                     <CheckIcon className="ml-auto size-4" />
//                                   ) : (
//                                     <div className="ml-auto size-4" />
//                                   )}
//                                 </ModelSelectorItem>
//                               ))}
//                           </ModelSelectorGroup>
//                         ))}
//                       </ModelSelectorList>
//                     </ModelSelectorContent>
//                   </ModelSelector>
//                 </PromptInputTools>

//                 {/* Nút Submit hoặc Stop */}
//                 {status === "streaming" ? (
//                   <button
//                     onClick={stopStreaming}
//                     className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
//                   >
//                     <StopCircle className="size-5" />
//                   </button>
//                 ) : (
//                   <PromptInputSubmit
//                     disabled={!text.trim() || status === "submitted"}
//                     status={status}
//                   />
//                 )}
//               </PromptInputFooter>
//             </PromptInput>
//           </div>
//         </div>
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
import { ToolUIPart } from "ai";
import { StopCircle, FileTextIcon } from "lucide-react"; // Added FileTextIcon
import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"; // Shadcn Button
import { DocumentPreviewSheet } from "./_components/DocumentPreviewSheet";

// Import the new Preview Component

// --- Types Definition ---

type SourceData = {
  source: string;
  page: number | null;
  content: string;
};

type MessageType = {
  key: string;
  from: "user" | "assistant";
  sources?: SourceData[]; // Updated to hold full source objects
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
  const [previewData, setPreviewData] = useState<{ fileName: string; highlights: string[] } | null>(null);

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);

  // --- Logic: Handle Open Preview ---
  const handleOpenPreview = (sources: SourceData[]) => {
    if (!sources || sources.length === 0) return;

    // Logic: Take the first source filename found (or extend UI to choose file)
    const targetFile = sources[0].source;


    // Collect all content snippets that belong to this file for highlighting
    const highlights = sources
      .filter((s) => s.source === targetFile)
      .map((s) => s.content);

    setPreviewData({
      fileName: targetFile,
      highlights: highlights,
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
        "http://127.0.0.1:8000/api/v1/rag/chat-stream",
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
          fileName={previewData.fileName}
          highlights={previewData.highlights}
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