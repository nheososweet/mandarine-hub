"use client";

import React from "react";
import { Copy, Terminal } from "lucide-react";

const CodeSnippet = ({
  code,
  lang = "bash",
}: {
  code: string;
  lang?: string;
}) => (
  <div className="my-6 rounded-lg bg-[#0c0c0c] border border-white/10 overflow-hidden group">
    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
      <span className="text-xs font-mono text-zinc-500">{lang}</span>
      <Copy className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-white transition-colors" />
    </div>
    <pre className="p-4 overflow-x-auto text-sm font-mono text-zinc-300 leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
      <code>{code}</code>
    </pre>
  </div>
);

const ApiTable = () => (
  <div className="overflow-x-auto my-6 border border-white/10 rounded-lg">
    <table className="w-full text-left text-sm text-zinc-400">
      <thead className="bg-white/5 text-zinc-200 font-medium">
        <tr>
          <th className="px-4 py-3">Parameter</th>
          <th className="px-4 py-3">Type</th>
          <th className="px-4 py-3">Description</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        <tr>
          <td className="px-4 py-3 font-mono text-orange-400">agent_id</td>
          <td className="px-4 py-3 font-mono">string</td>
          <td className="px-4 py-3">
            Unique identifier for the agent instance.
          </td>
        </tr>
        <tr>
          <td className="px-4 py-3 font-mono text-orange-400">prompt</td>
          <td className="px-4 py-3 font-mono">string</td>
          <td className="px-4 py-3">The instruction or query for the agent.</td>
        </tr>
        <tr>
          <td className="px-4 py-3 font-mono text-orange-400">stream</td>
          <td className="px-4 py-3 font-mono">boolean</td>
          <td className="px-4 py-3">
            Whether to stream the response (default: true).
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default function DocsPage() {
  return (
    <div className="prose prose-invert prose-orange max-w-4xl mx-auto pb-20">
      {/* INTRO */}
      <section id="intro" className="mb-20 border-b border-white/10 pb-10">
        <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
          Introduction
        </h1>
        <p className="text-xl text-zinc-400 leading-relaxed">
          Mandarine Hub is a modular Operating System designed for orchestrating{" "}
          <strong className="text-white">multi-agent systems</strong>,
          generating ultra-realistic{" "}
          <strong className="text-white">TTS/STS</strong>, and automating
          complex workflows.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h3 className="text-white font-bold mb-2">For Developers</h3>
            <p className="text-sm text-zinc-400">
              Robust SDKs, CLI tools, and fully typed APIs.
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h3 className="text-white font-bold mb-2">For Enterprise</h3>
            <p className="text-sm text-zinc-400">
              Scalable infrastructure, SLA support, and private cloud.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK START */}
      <section
        id="quick-start"
        className="mb-20 border-b border-white/10 pb-10"
      >
        <h2 className="text-3xl font-bold text-white mb-6">Quick Start</h2>
        <p className="text-zinc-400 mb-4">
          Initialize a new Mandarine project using our CLI tool. This will
          scaffold a basic multi-agent setup.
        </p>
        <CodeSnippet code="npm create mandarine-app@latest my-agent-swarm" />

        <h3 className="text-xl font-bold text-white mt-8 mb-4">Installation</h3>
        <p className="text-zinc-400">
          Alternatively, install the core SDK into an existing project:
        </p>
        <CodeSnippet code="npm install @mandarine/core @mandarine/agents" />
      </section>

      {/* API REFERENCE */}
      <section id="api" className="mb-20">
        <h2 className="text-3xl font-bold text-white mb-6">API Reference</h2>
        <p className="text-zinc-400 mb-6">
          The Mandarine API allows you to interact programmatically with your
          agent swarm. Below is the specification for the{" "}
          <code className="text-orange-400 bg-orange-400/10 px-1 rounded">
            /v1/chat/completions
          </code>{" "}
          endpoint.
        </p>

        <div className="bg-zinc-900 rounded-lg p-4 border border-white/10 mb-6">
          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold mr-3">
            POST
          </span>
          <span className="font-mono text-sm text-zinc-300">
            https://api.mandarine.hub/v1/execute
          </span>
        </div>

        <ApiTable />

        <h3 className="text-xl font-bold text-white mt-8 mb-4">
          Example Request
        </h3>
        <CodeSnippet
          lang="javascript"
          code={`const response = await fetch('https://api.mandarine.hub/v1/execute', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    agent_id: 'researcher-01',
    prompt: 'Analyze the latest trends in Quantum Computing',
    stream: false
  })
});

const data = await response.json();
console.log(data);`}
        />
      </section>
    </div>
  );
}
