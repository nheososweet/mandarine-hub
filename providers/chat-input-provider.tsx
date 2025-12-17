// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   ReactNode,
// } from "react";
// import { toast } from "sonner";
// import { useStore } from "@/stores/os-store"; // Store của bạn
// import useAIChatStreamHandler from "@/hooks/useAIStreamHandler"; // Hook của bạn
// import { useQueryState } from "nuqs";

// interface ChatInputContextType {
//   inputMessage: string;
//   files: File[];
//   isListening: boolean;
//   isExpanded: boolean;
//   isLoading: boolean;
//   canSubmit: boolean;
//   setInputMessage: (msg: string) => void;
//   setExpanded: (val: boolean) => void;
//   setIsListening: (val: boolean) => void;
//   handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   removeFile: (index: number) => void;
//   handleSubmit: () => Promise<void>;
//   setIsFocused: (val: boolean) => void;
//   isFocused: boolean;
// }

// const ChatInputContext = createContext<ChatInputContextType | undefined>(
//   undefined
// );

// export const ChatInputProvider = ({ children }: { children: ReactNode }) => {
//   const { handleStreamResponse } = useAIChatStreamHandler();
//   const isStreaming = useStore((state) => state.isStreaming);
//   const [selectedAgent] = useQueryState("agent");
//   const [teamId] = useQueryState("team");

//   // State
//   const [inputMessage, setInputMessage] = useState("");
//   const [files, setFiles] = useState<File[]>([]);
//   const [isListening, setIsListening] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isFocused, setIsFocused] = useState(false);

//   // Handlers
//   const handleFileChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       if (e.target.files && e.target.files.length > 0) {
//         setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
//         e.target.value = "";
//       }
//     },
//     []
//   );

//   const removeFile = useCallback((index: number) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   }, []);

//   const handleSubmit = useCallback(async () => {
//     if ((!inputMessage.trim() && files.length === 0) || isStreaming) return;
//     const msgToSend = inputMessage;

//     // Reset UI ngay lập tức
//     setInputMessage("");
//     setFiles([]);
//     setIsExpanded(false);

//     try {
//       await handleStreamResponse(msgToSend);
//     } catch (error) {
//       toast.error("Gửi tin nhắn thất bại");
//       setInputMessage(msgToSend); // Revert nếu lỗi
//     }
//   }, [inputMessage, files, isStreaming, handleStreamResponse]);

//   const canSubmit = !!(
//     (selectedAgent || teamId) &&
//     (inputMessage.trim() || files.length > 0) &&
//     !isStreaming
//   );

//   return (
//     <ChatInputContext.Provider
//       value={{
//         inputMessage,
//         files,
//         isListening,
//         isExpanded,
//         isLoading: isStreaming,
//         canSubmit,
//         setInputMessage,
//         setExpanded: setIsExpanded,
//         setIsListening,
//         handleFileChange,
//         removeFile,
//         handleSubmit,
//         isFocused,
//         setIsFocused
//       }}
//     >
//       {children}
//     </ChatInputContext.Provider>
//   );
// };

// export const useChatInput = () => {
//   const context = useContext(ChatInputContext);
//   if (!context)
//     throw new Error("useChatInput must be used within ChatInputProvider");
//   return context;
// };

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { useStore } from "@/stores/os-store";
import useAIChatStreamHandler from "@/hooks/useAIStreamHandler";
import { useQueryState } from "nuqs";
import { v4 as uuidv4 } from 'uuid'; // Cần cài: npm install uuid @types/uuid

// Định nghĩa kiểu dữ liệu cho file đính kèm
export type FileStatus = "uploading" | "success" | "error";

export interface Attachment {
  id: string;
  file: File;
  status: FileStatus;
  previewUrl?: string; // Dành cho ảnh
}

interface ChatInputContextType {
  inputMessage: string;
  files: Attachment[]; // Đổi từ File[] sang Attachment[]
  isListening: boolean;
  isExpanded: boolean;
  isLoading: boolean;
  canSubmit: boolean;
  isFocused: boolean;
  setInputMessage: (msg: string) => void;
  setExpanded: (val: boolean) => void;
  setIsListening: (val: boolean) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (id: string) => void; // Xóa theo ID
  handleSubmit: () => Promise<void>;
  setIsFocused: (val: boolean) => void;
}

const ChatInputContext = createContext<ChatInputContextType | undefined>(
  undefined
);

export const ChatInputProvider = ({ children }: { children: ReactNode }) => {
  const { handleStreamResponse } = useAIChatStreamHandler();
  const isStreaming = useStore((state) => state.isStreaming);
  const [selectedAgent] = useQueryState("agent");
  const [teamId] = useQueryState("team");

  // State
  const [inputMessage, setInputMessage] = useState("");
  const [files, setFiles] = useState<Attachment[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Handlers
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: Attachment[] = Array.from(e.target.files).map((file) => ({
        id: uuidv4(), // Tạo ID giả, bạn có thể dùng Date.now() nếu không muốn cài uuid
        file,
        status: "uploading", // Mặc định là đang upload
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined
      }));

      setFiles((prev) => [...prev, ...newFiles]);
      e.target.value = "";

      // Giả lập upload: Sau 1.5s chuyển sang success
      newFiles.forEach((attachment) => {
        setTimeout(() => {
          setFiles((currentFiles) =>
            currentFiles.map((f) =>
              f.id === attachment.id ? { ...f, status: "success" } : f
            )
          );
        }, 1500);
      });
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      // Revoke URL để tránh memory leak
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.previewUrl) URL.revokeObjectURL(fileToRemove.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    // Chỉ gửi khi có text hoặc có file (và file phải upload xong - logic tuỳ chỉnh)
    const isUploading = files.some(f => f.status === "uploading");
    if ((!inputMessage.trim() && files.length === 0) || isStreaming || isUploading) return;

    const msgToSend = inputMessage;

    // Reset UI
    setInputMessage("");
    setFiles([]);
    setIsExpanded(false);

    try {
      await handleStreamResponse(msgToSend);
    } catch (error) {
      toast.error("Gửi tin nhắn thất bại");
      setInputMessage(msgToSend);
    }
  }, [inputMessage, files, isStreaming, handleStreamResponse]);

  const isUploading = files.some(f => f.status === "uploading");

  const canSubmit = !!(
    (selectedAgent || teamId) &&
    (inputMessage.trim() || files.length > 0) &&
    !isStreaming &&
    !isUploading
  );

  return (
    <ChatInputContext.Provider
      value={{
        inputMessage,
        files,
        isListening,
        isExpanded,
        isLoading: isStreaming,
        canSubmit,
        isFocused,
        setInputMessage,
        setExpanded: setIsExpanded,
        setIsListening,
        handleFileChange,
        removeFile,
        handleSubmit,
        setIsFocused
      }}
    >
      {children}
    </ChatInputContext.Provider>
  );
};

export const useChatInput = () => {
  const context = useContext(ChatInputContext);
  if (!context)
    throw new Error("useChatInput must be used within ChatInputProvider");
  return context;
};