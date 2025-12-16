"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Citrus,
  Menu,
  Sparkles,
  Bot,
  Mic,
  Workflow,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

// --- REACT BITS ---
import Particles from "@/components/Particles";
import SpotlightCard from "@/components/SpotlightCard";
import BlurText from "@/components/BlurText";
import StarBorder from "@/components/StarBorder";

// --- REACT FLOW IMPORTS ---
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AgentNode from "./_components/flows/AgentNode";
import Link from "next/link";

// Dữ liệu Node (Vị trí fix cứng để ra hình cây đẹp nhất)
const initialNodes = [
  // Level 1
  {
    id: "1",
    type: "agent",
    position: { x: 300, y: 0 },
    data: {
      label: "Language Router",
      role: "Team Leader",
      model: "GPT-4o",
      color: "orange",
    },
  },
  // Level 2
  {
    id: "2",
    type: "agent",
    position: { x: 0, y: 150 },
    data: {
      label: "English Agent",
      role: "Member",
      model: "Claude 3.5",
      color: "blue",
    },
  },
  {
    id: "3",
    type: "agent",
    position: { x: 300, y: 150 },
    data: {
      label: "Chinese Agent",
      role: "Member",
      model: "Qwen-72B",
      color: "red",
    },
  },
  {
    id: "4",
    type: "agent",
    position: { x: 600, y: 150 },
    data: {
      label: "Germanic Team",
      role: "Sub-Team",
      model: "Llama 3",
      color: "purple",
    },
  },
  // Level 3 (Con của Germanic)
  {
    id: "5",
    type: "agent",
    position: { x: 500, y: 300 },
    data: {
      label: "German Agent",
      role: "Worker",
      model: "Mistral",
      color: "purple",
    },
  },
  {
    id: "6",
    type: "agent",
    position: { x: 700, y: 300 },
    data: {
      label: "Dutch Agent",
      role: "Worker",
      model: "Mixtral",
      color: "purple",
    },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#52525b" },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#52525b" },
  },
  {
    id: "e1-4",
    source: "1",
    target: "4",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#52525b" },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#52525b" },
  },
  {
    id: "e4-6",
    source: "4",
    target: "6",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#52525b" },
  },
];

const nodeTypes = { agent: AgentNode };

const NAV_LINKS = [
  { label: "Agents", href: "#agents" },
  { label: "TTS/STS", href: "#tts" },
  { label: "Workflows", href: "#workflows" },
  { label: "Pricing", href: "#pricing" },
];

const AGENTS = [
  {
    title: "Coder Agent",
    desc: "Expert in Python, JS, Rust. Writes clean, tested code.",
    icon: <Bot className="w-6 h-6 text-blue-400" />,
  },
  {
    title: "Research Agent",
    desc: "Scrapes web, summarizes papers, generates reports.",
    icon: <BookOpen className="w-6 h-6 text-purple-400" />,
  },
  {
    title: "Support Agent",
    desc: "24/7 Customer service with empathetic responses.",
    icon: <Bot className="w-6 h-6 text-green-400" />,
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "$0",
    features: ["1 Agent", "Basic TTS", "Community Support"],
  },
  {
    name: "Pro",
    price: "$29",
    features: ["Unlimited Agents", "Clone Voice", "Priority Support"],
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Private Cloud", "Fine-tuning", "SLA"],
  },
];

export default function MandarineHubHome() {
  const [activeSection, setActiveSection] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.getBoundingClientRect().top <= 150) {
          current = section;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#080010] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <Particles
          particleColors={["#ffffff", "#ffaa40"]}
          particleCount={120}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080010_100%)]" />
      </div>

      {/* NAVBAR */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="flex items-center justify-between w-full max-w-5xl px-6 py-3 bg-[#080010]/70 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all duration-300">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="p-1.5 bg-orange-500/20 rounded-full border border-orange-500/30 group-hover:bg-orange-500/30 transition-colors">
              <Citrus className="w-5 h-5 text-orange-400" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight group-hover:text-orange-100 transition-colors">
              Mandarine Hub
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === link.href.substring(1)
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/docs"
              className="hidden md:block text-sm font-medium text-zinc-300 hover:text-white"
            >
              Docs
            </a>
            <Link href={"/dashboard"}>
              <Button
                size="sm"
                className="hidden sm:flex rounded-full bg-white text-black hover:bg-zinc-200 font-semibold px-5"
              >
                Launch App
              </Button>
            </Link>

            {/* --- MOBILE MENU (FIXED STYLE) --- */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-300 hover:text-white hover:bg-white/10 rounded-full"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                {/* Fix style ở đây: force background tối, bỏ viền trắng mặc định */}
                <SheetContent
                  side="right"
                  className="w-75 border-l border-white/10 bg-[#080010]/95 backdrop-blur-xl text-white p-6 shadow-2xl z-[100]"
                >
                  <SheetHeader className="mb-8 text-left">
                    <SheetTitle className="flex items-center gap-2 text-white">
                      <Citrus className="w-5 h-5 text-orange-400" />
                      <span className="font-display font-bold">
                        Mandarine Hub
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 mt-4">
                    {NAV_LINKS.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="text-lg font-medium text-zinc-400 hover:text-orange-400 transition-colors flex items-center justify-between group"
                      >
                        <SheetClose className="w-full text-left">
                          {link.label}
                        </SheetClose>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-orange-400" />
                      </a>
                    ))}
                    <div className="h-[1px] w-full bg-white/10 my-2"></div>
                    <a
                      href="/docs"
                      className="text-lg font-medium text-zinc-400 hover:text-orange-400 transition-colors"
                    >
                      <SheetClose>Documentation</SheetClose>
                    </a>
                    <Button className="w-full mt-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 shadow-lg shadow-orange-500/20">
                      Launch App Now
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {/* --------------------------------- */}
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="bg-white/5 border-white/10 text-orange-300 mb-6 backdrop-blur-md gap-2"
          >
            <Sparkles className="w-3 h-3" />
            Mandarine OS v1.0 Alpha
          </Badge>
        </motion.div>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent max-w-4xl mx-auto leading-[1.1]">
          Orchestrate Your <br />
          <span className="text-white">Digital Workforce</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The ultimate platform for multi-agent systems, advanced TTS/STS
          synthesis, and autonomous workflows.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            size="lg"
            className="rounded-full bg-white text-black hover:bg-zinc-200 font-bold px-8 h-12"
          >
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 h-12 border-white/20 text-white hover:bg-white/10"
            onClick={() => (window.location.href = "/docs")}
          >
            Documentation
          </Button>
        </div>
      </section>

      {/* SECTION 1: AGENTS */}
      <section
        id="agents"
        className="relative z-10 py-24 container mx-auto px-4"
      >
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Bot className="w-10 h-10 text-orange-500" />
          </div>
          <BlurText
            text="Autonomous Agents"
            className="text-4xl md:text-5xl font-bold mb-4 block text-white"
            delay={20}
          />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Deploy specialized AI workers that collaborate to solve complex
            tasks autonomously.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AGENTS.map((agent, idx) => (
            <SpotlightCard
              key={idx}
              className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 h-full"
              spotlightColor="rgba(249, 115, 22, 0.2)"
            >
              <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                {agent.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {agent.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">{agent.desc}</p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* SECTION 2: TTS/STS */}
      <section id="tts" className="relative z-10 py-24 bg-white/2">
        {/* Giữ nguyên nội dung TTS */}
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="flex items-center gap-2 mb-4 text-orange-400 font-mono text-sm uppercase tracking-wider">
              <Mic className="w-4 h-4" /> Next-Gen Voice
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Human-like <br />{" "}
              <span className="text-orange-500">Synthesis</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Experience ultra-low latency Text-to-Speech and Speech-to-Speech.
              Clone voices in seconds.
            </p>
          </div>
          <div className="md:w-1/2 w-full flex items-center justify-center">
            <SpotlightCard
              className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 aspect-video flex items-center justify-center"
              spotlightColor="rgba(59, 130, 246, 0.2)"
            >
              <div className="flex gap-2 items-center">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 bg-orange-500 rounded-full"
                    animate={{ height: [20, 60, 30, 80, 40] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: VISUAL WORKFLOWS (REACT FLOW) --- */}
      <section
        id="workflows"
        className="relative z-10 py-24 container mx-auto px-4"
      >
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Workflow className="w-10 h-10 text-blue-500" />
          </div>
          <BlurText
            text="Visual Agent Swarm"
            className="text-4xl md:text-5xl font-bold mb-4 block text-white"
            delay={20}
          />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Visualize your multi-agent architecture with our interactive graph.
          </p>
        </div>

        {/* REACT FLOW CONTAINER */}
        <div className="w-full h-[600px] rounded-3xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-2xl">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }} // Ẩn logo ReactFlow nếu có bản pro
            panOnScroll={false} // Tắt scroll để tránh conflict với trang
            zoomOnScroll={false}
            nodesConnectable={false} // Readonly
            nodesDraggable={false} // Readonly
          >
            <Background color="#333" gap={20} size={1} />
            <Controls className="bg-zinc-800 border-white/10 [&>button]:fill-white [&>button]:text-white" />
          </ReactFlow>
        </div>
      </section>

      {/* SECTION 4: PRICING */}
      <section
        id="pricing"
        className="relative z-10 py-24 container mx-auto px-4 pb-40"
      >
        <div className="text-center mb-16">
          <BlurText
            text="Simple Pricing"
            className="text-4xl md:text-5xl font-bold mb-4 block text-white"
            delay={20}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {PRICING.map((plan, idx) => (
            <div
              key={idx}
              className={`relative ${plan.recommended ? "md:-mt-8" : ""}`}
            >
              {plan.recommended && (
                <div className="absolute -top-10 left-0 right-0 flex justify-center">
                  <span className="bg-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}
              <SpotlightCard
                className={`bg-zinc-900/80 border ${
                  plan.recommended ? "border-orange-500/50" : "border-white/10"
                } rounded-3xl p-8 flex flex-col h-full`}
                spotlightColor={
                  plan.recommended
                    ? "rgba(249, 115, 22, 0.15)"
                    : "rgba(255, 255, 255, 0.05)"
                }
              >
                <h3 className="text-xl font-medium text-zinc-400 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-white mb-6">
                  {plan.price}
                  <span className="text-lg text-zinc-500 font-normal">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 text-sm text-zinc-300"
                    >
                      <Check className="w-4 h-4 text-white" /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full py-6 rounded-xl ${
                    plan.recommended
                      ? "bg-orange-600 hover:bg-orange-500"
                      : "bg-white/5 hover:bg-white/10 border border-white/5"
                  } text-white`}
                >
                  Get Started
                </Button>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
