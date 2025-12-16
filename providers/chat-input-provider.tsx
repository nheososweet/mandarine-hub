"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { useStore } from "@/stores/os-store"; // Store của bạn
import useAIChatStreamHandler from "@/hooks/useAIStreamHandler"; // Hook của bạn
import { useQueryState } from "nuqs";

interface ChatInputContextType {
  inputMessage: string;
  files: File[];
  isListening: boolean;
  isExpanded: boolean;
  isLoading: boolean;
  canSubmit: boolean;
  setInputMessage: (msg: string) => void;
  setExpanded: (val: boolean) => void;
  setIsListening: (val: boolean) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  handleSubmit: () => Promise<void>;
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
  const [files, setFiles] = useState<File[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handlers
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
        e.target.value = ""; // Reset để chọn lại được file cũ nếu cần
      }
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if ((!inputMessage.trim() && files.length === 0) || isStreaming) return;
    const msgToSend = inputMessage;

    // Reset UI ngay lập tức
    setInputMessage("");
    setFiles([]);
    setIsExpanded(false);

    try {
      await handleStreamResponse(msgToSend);
    } catch (error) {
      toast.error("Gửi tin nhắn thất bại");
      setInputMessage(msgToSend); // Revert nếu lỗi
    }
  }, [inputMessage, files, isStreaming, handleStreamResponse]);

  const canSubmit = !!(
    (selectedAgent || teamId) &&
    (inputMessage.trim() || files.length > 0) &&
    !isStreaming
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
        setInputMessage,
        setExpanded: setIsExpanded,
        setIsListening,
        handleFileChange,
        removeFile,
        handleSubmit,
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
