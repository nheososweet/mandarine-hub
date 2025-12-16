import { Cpu } from "lucide-react";
import { motion } from "framer-motion";

// Sub-component cho Node trong Workflow
export const AgentNode = ({
  role,
  name,
  model,
  color = "blue",
  delay = 0,
  small = false,
}: any) => {
  const colorMap: any = {
    orange: "border-orange-500/50 bg-orange-500/10 text-orange-400",
    blue: "border-blue-500/50 bg-blue-500/10 text-blue-400",
    red: "border-red-500/50 bg-red-500/10 text-red-400",
    purple: "border-purple-500/50 bg-purple-500/10 text-purple-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`
                relative bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-white/30 transition-all duration-300
                ${small ? "w-40 p-3" : "w-48 p-4"}
            `}
    >
      {/* Header: Role */}
      <div className="text-xs font-mono text-zinc-500 mb-1 uppercase tracking-wider">
        {role}
      </div>

      {/* Body: Name */}
      <div className="text-white font-bold text-sm mb-3">{name}</div>

      {/* Footer: Model Badge */}
      <div
        className={`
                inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-mono font-medium
                ${colorMap[color]}
            `}
      >
        <Cpu className="w-3 h-3" />
        {model}
      </div>

      {/* Top Connector Dot */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-500 rounded-full"></div>
      {/* Bottom Connector Dot */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-500 rounded-full"></div>
    </motion.div>
  );
};
