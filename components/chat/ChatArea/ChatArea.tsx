"use client";

import { ChatInputProvider } from "@/providers/chat-input-provider";
import ChatInput from "./ChatInput";
import MessageArea from "./MessageArea";
const ChatArea = () => {
  return (
    <main className="relative m-1.5 flex grow flex-col rounded-xl bg-card">
      <MessageArea />
      <div className="sticky bottom-0 ml-9 px-4 pb-2">
        <ChatInputProvider>
          <ChatInput />
        </ChatInputProvider>
      </div>
    </main>
  );
};

export default ChatArea;
