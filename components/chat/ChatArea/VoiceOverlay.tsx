// "use client";

// import React from "react";
// import { Mic, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useChatInput } from "@/providers/chat-input-provider";
// import { motion, AnimatePresence } from "framer-motion";

// const VoiceOverlay = () => {
//     const { isListening, setIsListening } = useChatInput();

//     return (
//         <AnimatePresence>
//             {isListening && (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
//                 >
//                     {/* Vùng Animation chính */}
//                     <div className="relative flex items-center justify-center">
//                         {/* Vòng sóng âm 1 (Lớn, chậm) */}
//                         <div className="absolute h-40 w-40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-primary/20" />

//                         {/* Vòng sóng âm 2 (Nhỏ, nhanh hơn) */}
//                         <div className="absolute h-28 w-28 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-primary/30 delay-150" />

//                         {/* Nút Mic trung tâm */}
//                         <motion.div
//                             initial={{ scale: 0.8 }}
//                             animate={{ scale: 1 }}
//                             transition={{ type: "spring", stiffness: 200, damping: 10 }}
//                             className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-600 shadow-2xl shadow-primary/50"
//                         >
//                             <Mic className="h-10 w-10 text-white" />
//                         </motion.div>
//                     </div>

//                     {/* Text trạng thái - SỬA LỖI DELAY TẠI ĐÂY */}
//                     <motion.div
//                         initial={{ y: 20, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         transition={{ delay: 0.1 }} // Chuyển delay vào trong transition
//                         className="mt-10 text-center"
//                     >
//                         <h3 className="text-2xl font-semibold tracking-tight text-foreground">
//                             I'm listening...
//                         </h3>
//                         <p className="mt-2 text-sm text-muted-foreground">
//                             Say something to start chatting
//                         </p>
//                     </motion.div>

//                     {/* Nút Cancel - SỬA LỖI DELAY TẠI ĐÂY */}
//                     <motion.div
//                         initial={{ y: 20, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         transition={{ delay: 0.2 }} // Chuyển delay vào trong transition
//                         className="mt-8"
//                     >
//                         <Button
//                             variant="outline"
//                             size="lg"
//                             className="rounded-full border-border bg-background/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
//                             onClick={() => setIsListening(false)}
//                         >
//                             <X className="mr-2 h-4 w-4" /> Cancel
//                         </Button>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// };

// export default VoiceOverlay;

"use client";

import React from "react";
import { Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatInput } from "@/providers/chat-input-provider";
import { motion, AnimatePresence } from "framer-motion";

const VoiceOverlay = () => {
    const { isListening, setIsListening } = useChatInput();

    return (
        <AnimatePresence>
            {isListening && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    // SỬA: Dùng absolute để nó chỉ phủ lên container cha (ChatArea)
                    // z-50 để đè lên tin nhắn, nhưng vẫn nằm trong khung bo tròn
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
                >
                    {/* Animation sóng âm */}
                    <div className="relative flex items-center justify-center">
                        <div className="absolute h-40 w-40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-primary/20" />
                        <div className="absolute h-28 w-28 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-primary/30 delay-150" />

                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-600 shadow-2xl shadow-primary/50"
                        >
                            <Mic className="h-10 w-10 text-white" />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mt-10 text-center"
                    >
                        <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                            I'm listening...
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Say something to start chatting
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8"
                    >
                        <Button
                            variant="outline"
                            size="lg"
                            className="cursor-pointer rounded-full border-border bg-background/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                            onClick={() => setIsListening(false)}
                        >
                            <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VoiceOverlay;