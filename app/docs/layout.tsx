"use client";

import React, { useState, useEffect } from "react";
import { Citrus, Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

const DOCS_NAV = [
  { title: "Introduction", href: "/docs#intro" },
  { title: "Quick Start", href: "/docs#quick-start" },
  {
    title: "Core Concepts",
    href: "/docs#concepts",
    sub: [
      { title: "Agents", href: "/docs#agents" },
      { title: "Workflows", href: "/docs#workflows" },
      { title: "TTS Engine", href: "/docs#tts" },
    ],
  },
  { title: "API Reference", href: "/docs#api" },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeId, setActiveId] = useState("");

  // Logic Scroll-spy đơn giản
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((section) => {
        const top = (section as HTMLElement).offsetTop;
        if (window.scrollY >= top - 150) {
          current = section.getAttribute("id") || "";
        }
      });
      setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const SidebarContent = () => (
    <div className="py-6 pr-4">
      <Link href="/" className="flex items-center gap-2 mb-8 px-2">
        <Citrus className="w-6 h-6 text-orange-500" />
        <span className="font-bold text-lg text-white">Mandarine Docs</span>
      </Link>
      <nav className="space-y-1">
        {DOCS_NAV.map((item) => (
          <div key={item.title}>
            <a
              href={item.href}
              className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                activeId === item.href.replace("/docs#", "")
                  ? "bg-orange-500/10 text-orange-400 font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.title}
            </a>
            {item.sub && (
              <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">
                {item.sub.map((sub) => (
                  <a
                    key={sub.title}
                    href={sub.href}
                    className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                      activeId === sub.href.replace("/docs#", "")
                        ? "text-orange-400"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {sub.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080010] text-zinc-300 font-sans selection:bg-orange-500/30">
      {/* MOBILE HEADER */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#080010]/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="font-bold text-white flex gap-2">
          <Citrus className="w-5 h-5 text-orange-500" /> Docs
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-[#080010] border-r border-white/10 w-[280px]"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      <div className="container mx-auto px-4 flex max-w-7xl">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 overflow-y-auto border-r border-white/10 scrollbar-none">
          <SidebarContent />
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 py-10 md:px-12">{children}</main>
      </div>
    </div>
  );
}
