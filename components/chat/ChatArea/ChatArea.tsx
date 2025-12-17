// "use client";

// import { ChatInputProvider } from "@/providers/chat-input-provider";
// import ChatInput from "./ChatInput";
// import MessageArea from "./MessageArea";
// import VoiceOverlay from "./VoiceOverlay";
// const ChatArea = () => {
//   return (
//     <main className="relative m-1.5 flex grow flex-col rounded-xl bg-card">
//       <MessageArea />
//       <div className="sticky bottom-0 ml-9 px-4 pb-2">
//         <ChatInputProvider>
//           <ChatInput />
//           <VoiceOverlay />
//         </ChatInputProvider>
//       </div>
//     </main>
//   );
// };

// export default ChatArea;


"use client";

import { ChatInputProvider } from "@/providers/chat-input-provider";
import ChatInput from "./ChatInput";
import MessageArea from "./MessageArea";
import VoiceOverlay from "./VoiceOverlay";

const ChatArea = () => {
  return (
    // 1. Provider bọc toàn bộ ChatArea để VoiceOverlay và ChatInput cùng truy cập state
    <ChatInputProvider>
      <main className="relative m-1.5 flex grow flex-col rounded-xl bg-card overflow-hidden">

        {/* Khu vực tin nhắn */}
        <MessageArea />

        {/* 2. Voice Overlay đặt ở đây. 
           Vì main có 'relative', Overlay 'absolute' sẽ phủ kín main.
           Main có 'overflow-hidden' nên Overlay sẽ không bị tràn ra ngoài bo góc.
        */}
        <VoiceOverlay />

        {/* Khu vực Input */}
        <div className="sticky bottom-0 ml-9 px-4 pb-2 z-20">
          <ChatInput />
        </div>
      </main>
    </ChatInputProvider>
  );
};

export default ChatArea;