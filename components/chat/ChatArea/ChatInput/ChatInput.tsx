// "use client";
// import { Button } from "@/components/ui/button";
// import { useStore } from "@/stores/os-store";
// import { useQueryState } from "nuqs";
// import Icon from "@/components/ui/icon";
// import { TextArea } from "@/components/ui/os/textarea";
// import { Mic, MoveDiagonal, Paperclip, Send, Minimize2 } from "lucide-react";
// import { useChatInput } from "@/providers/chat-input-provider";
// import { cn } from "@/lib/utils";
// import { useEffect, useRef } from "react";

// const ChatInput = () => {
//   const { chatInputRef } = useStore();
//   const {
//     inputMessage,
//     setInputMessage,
//     isExpanded,
//     setExpanded,
//     handleSubmit,
//     canSubmit,
//     isFocused,
//     setIsFocused
//   } = useChatInput();

//   const [selectedAgent] = useQueryState("agent");
//   const [teamId] = useQueryState("team");
//   const isStreaming = useStore((state) => state.isStreaming);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const toggleExpand = () => {
//     setExpanded(!isExpanded);
//   };

//   const handleFocus = () => setIsFocused(true);
//   const handleBlur = () => setIsFocused(false);

//   const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     // Nếu click vào button thì không focus
//     if ((e.target as HTMLElement).closest("button")) {
//       return;
//     }
//     chatInputRef?.current?.focus();
//   };
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(e.target as Node)
//       ) {
//         chatInputRef?.current?.blur();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [chatInputRef]);

//   return (
//     <div
//       ref={containerRef}
//       onClick={handleContainerClick}
//       className={cn(
//         "group relative mx-auto w-full max-w-2xl mb-1 p-1 justify-center gap-x-2 font-geist border rounded-xl transition-all duration-150",
//         isFocused ? "border-primary" : "border-border"
//       )}>
//       <TextArea
//         placeholder={"Type your message..."}
//         value={inputMessage}
//         onChange={(e) => setInputMessage(e.target.value)}
//         onKeyDown={(e) => {
//           if (
//             e.key === "Enter" &&
//             !e.nativeEvent.isComposing &&
//             !e.shiftKey &&
//             !isStreaming
//           ) {
//             e.preventDefault();
//             handleSubmit();
//           }
//         }}
//         className="w-full border border-accent bg-primaryAccent px-4 text-sm text-foreground focus:border-accent custom-scrollbar"
//         disabled={!(selectedAgent || teamId)}
//         ref={chatInputRef}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         isExpanded={isExpanded}
//       />
//       <div className="flex justify-between">
//         <div>
//           <Button className="cursor-pointer" size={"icon-sm"} variant={"ghost"}>
//             <Paperclip className="h-4 w-4" />
//           </Button>
//           <Button className="cursor-pointer" size={"icon-sm"} variant={"ghost"}>
//             <Mic className="h-4 w-4" />
//           </Button>
//         </div>
//         <div>
//           <Button
//             onClick={toggleExpand}
//             className="cursor-pointer"
//             size={"icon-sm"}
//             variant={"ghost"}
//             title={isExpanded ? "Collapse" : "Expand"}
//           >
//             {isExpanded ? (
//               <Minimize2 className="h-4 w-4" />
//             ) : (
//               <MoveDiagonal className="h-4 w-4" />
//             )}
//           </Button>
//           <Button
//             onClick={handleSubmit}
//             disabled={!canSubmit}
//             size="icon-sm"
//             className="cursor-pointer"
//             variant={"ghost"}
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInput;


"use client";
import { Button } from "@/components/ui/button";
import { useStore } from "@/stores/os-store";
import { useQueryState } from "nuqs";
import { TextArea } from "@/components/ui/os/textarea";
import { Mic, MoveDiagonal, Paperclip, Send, Minimize2 } from "lucide-react";
import { useChatInput } from "@/providers/chat-input-provider";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { FilePreviewItem } from "../../File/FilePreviewItem";

const ChatInput = () => {
  const { chatInputRef } = useStore();

  // Lấy thêm các state và function xử lý file từ hook
  const {
    inputMessage,
    setInputMessage,
    files, // Danh sách file (đã là dạng Attachment)
    handleFileChange, // Hàm xử lý chọn file
    removeFile, // Hàm xóa file
    isExpanded,
    setExpanded,
    handleSubmit,
    canSubmit,
    isFocused,
    setIsFocused,
    setIsListening
  } = useChatInput();

  const [selectedAgent] = useQueryState("agent");
  const [teamId] = useQueryState("team");
  const isStreaming = useStore((state) => state.isStreaming);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref cho input file ẩn

  const toggleExpand = () => {
    setExpanded(!isExpanded);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Xử lý click vào container để focus input (trừ khi click vào file item hoặc button)
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest(".file-preview-item")
    ) {
      return;
    }
    chatInputRef?.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        chatInputRef?.current?.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [chatInputRef]);

  // Hàm kích hoạt input file
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={cn(
        // Giữ nguyên class gốc của bạn
        "group relative mx-auto w-full max-w-2xl mb-1 p-1 justify-center gap-x-2 font-geist border rounded-xl transition-all duration-150 bg-background",
        isFocused ? "border-primary" : "border-border"
      )}
    >
      {/* --- PHẦN MỚI: HIỂN THỊ DANH SÁCH FILE --- */}
      {files.length > 0 && (
        <div className={cn(
          "flex w-full gap-2 overflow-x-auto px-2 py-2 mb-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 ",
          "[&::-webkit-scrollbar]:h-1.5",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-border",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground/50"
        )}>
          {files.map((attachment) => (
            <FilePreviewItem
              key={attachment.id}
              attachment={attachment}
              onRemove={removeFile}
            />
          ))}
        </div>
      )}

      {/* --- TEXTAREA (Giữ nguyên logic) --- */}
      <TextArea
        placeholder={"Type your message..."}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !e.nativeEvent.isComposing &&
            !e.shiftKey &&
            !isStreaming
          ) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        className="w-full border border-accent bg-primaryAccent px-4 text-sm text-foreground focus:border-accent custom-scrollbar"
        disabled={!(selectedAgent || teamId)}
        ref={chatInputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isExpanded={isExpanded}
      />

      {/* --- FOOTER BUTTONS --- */}
      <div className="flex justify-between">
        <div>
          {/* Input file ẩn */}
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {/* Nút Upload */}
          <Button
            className="cursor-pointer"
            size={"icon-sm"}
            variant={"ghost"}
            onClick={handleAttachClick} // Gắn hàm click
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <Button onClick={() => setIsListening(true)} className="cursor-pointer" size={"icon-sm"} variant={"ghost"}>
            <Mic className="h-4 w-4" />
          </Button>
        </div>

        <div>
          <Button
            onClick={toggleExpand}
            className="cursor-pointer"
            size={"icon-sm"}
            variant={"ghost"}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <MoveDiagonal className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleSubmit();
            }}
            disabled={!canSubmit}
            size={"icon-sm"}
            className="cursor-pointer"
            variant={"ghost"}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;