"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import SpotlightCard from "@/components/SpotlightCard";
import {
  Bot,
  Database,
  Zap,
  Activity,
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";
import BlurText from "@/components/BlurText";

const dataUsage = [
  { name: "Mon", tokens: 4000, cost: 2400 },
  { name: "Tue", tokens: 3000, cost: 1398 },
  { name: "Wed", tokens: 5000, cost: 9800 },
  { name: "Thu", tokens: 2780, cost: 3908 },
  { name: "Fri", tokens: 1890, cost: 4800 },
  { name: "Sat", tokens: 2390, cost: 3800 },
  { name: "Sun", tokens: 3490, cost: 4300 },
];

const dataModels = [
  { name: "GPT-4o", value: 400, color: "#f97316" },
  { name: "Claude 3.5", value: 300, color: "#3b82f6" },
  { name: "Llama 3", value: 300, color: "#a855f7" },
  { name: "Mistral", value: 200, color: "#22c55e" },
];

const STATS = [
  {
    label: "Active Agents",
    value: "8/10",
    icon: <Bot className="text-chart-1" />,
    sub: "3 Running, 5 Idle",
  },
  {
    label: "Vector DB Size",
    value: "2.4 GB",
    icon: <Database className="text-chart-2" />,
    sub: "1,204 Documents",
  },
  {
    label: "API Latency",
    value: "142ms",
    icon: <Zap className="text-chart-3" />,
    sub: "Global Average",
  },
  {
    label: "Credits",
    value: "$420.50",
    icon: <Activity className="text-chart-4" />,
    sub: "Pro Plan",
  },
];

const ACTIVITIES = [
  {
    id: 1,
    action: "Research Agent finished task",
    time: "2 mins ago",
    status: "success",
  },
  {
    id: 2,
    action: "Knowledge Base indexing",
    time: "15 mins ago",
    status: "processing",
  },
  {
    id: 3,
    action: "API Rate limit warning",
    time: "1 hour ago",
    status: "warning",
  },
  {
    id: 4,
    action: "New session started",
    time: "3 hours ago",
    status: "success",
  },
  {
    id: 5,
    action: "Model fine-tuning complete",
    time: "Yesterday",
    status: "success",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-7">
      <div className="flex items-end justify-between">
        <div>
          <BlurText
            text="Dashboard Overview"
            className="text-2xl font-bold text-foreground mb-1"
            delay={10}
          />
          <p className="text-muted-foreground text-sm">
            Real-time metrics of your Mandarine Swarm.
          </p>
        </div>
        <div className="text-xs font-mono text-muted-foreground bg-accent px-3 py-1 rounded-full border border-border flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-chart-4 animate-pulse" />{" "}
          System Operational
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <SpotlightCard
            key={i}
            className="bg-card! border border-border! rounded-xl p-5"
            // spotlightColor="rgba(255,255,255,0.05)"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-accent rounded-lg border border-border">
                {stat.icon}
              </div>
              <TrendingUp className="w-4 h-4 text-chart-4/50" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.sub}</div>
          </SpotlightCard>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Token Usage */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-muted-foreground">
              Token Consumption & Cost
            </h3>
            <select className="bg-accent border border-border text-xs text-muted-foreground rounded px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataUsage}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="tokens"
                  stroke="#f97316"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTokens)"
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCost)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Distribution */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-muted-foreground mb-4">
            Model Usage Distribution
          </h3>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataModels}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataModels.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-2xl font-bold text-foreground">1.2k</div>
              <div className="text-[10px] text-muted-foreground uppercase">
                Requests
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {dataModels.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  <span className="text-foreground">{m.name}</span>
                </div>
                <span className="text-muted-foreground">
                  {Math.round((m.value / 1200) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Recent System Logs
        </h3>
        <div className="space-y-1">
          {ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group cursor-default"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-1.5 rounded-full ${
                    act.status === "success"
                      ? "bg-chart-4/10 text-chart-4"
                      : act.status === "warning"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-chart-2/10 text-chart-2"
                  }`}
                >
                  {act.status === "success" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : act.status === "warning" ? (
                    <AlertTriangle className="w-3 h-3" />
                  ) : (
                    <Bot className="w-3 h-3" />
                  )}
                </div>
                <span className="text-sm text-foreground group-hover:text-foreground transition-colors">
                  {act.action}
                </span>
              </div>
              <span className="text-xs font-mono text-muted-foreground group-hover:text-muted-foreground">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
