"use client";
import { Button } from "@/components/ui/button";
import { useStore } from "@/stores/os-store";
import { useQueryState } from "nuqs";
import Icon from "@/components/ui/icon";
import { TextArea } from "@/components/ui/os/textarea";
import { Mic, MoveDiagonal, Paperclip, Send, Minimize2 } from "lucide-react";
import { useChatInput } from "@/providers/chat-input-provider";

const ChatInput = () => {
  const { chatInputRef } = useStore();
  const {
    inputMessage,
    setInputMessage,
    isExpanded,
    setExpanded,
    handleSubmit,
    canSubmit,
  } = useChatInput();

  const [selectedAgent] = useQueryState("agent");
  const [teamId] = useQueryState("team");
  const isStreaming = useStore((state) => state.isStreaming);

  const toggleExpand = () => {
    setExpanded(!isExpanded);
  };

  return (
    <div className="group relative mx-auto w-full max-w-2xl mb-1 p-1 justify-center gap-x-2 font-geist border border-border rounded-xl transition-all duration-300">
      <TextArea
        placeholder={"Ask anything"}
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
        isExpanded={isExpanded}
      />
      <div className="flex justify-between">
        <div>
          <Button className="cursor-pointer" size={"icon-sm"} variant={"ghost"}>
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button className="cursor-pointer" size={"icon-sm"} variant={"ghost"}>
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
            onClick={handleSubmit}
            disabled={!canSubmit}
            size="icon-sm"
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
