import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display", // Tên biến CSS
  display: "swap",
});

// 3. Cấu hình Font Figtree (Dùng cho Body/Sans)
const fontSans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans", // Tên biến CSS
  display: "swap",
});

// 1. Cấu hình Viewport riêng (Next.js 14+)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#080010" },
  ],
  width: "device-width",
  initialScale: 1,
};

// 2. Cấu hình SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"), // Thay bằng domain thật khi deploy
  title: {
    default: "Mandarine Hub - Orchestrate Your Digital Workforce",
    template: "%s | Mandarine Hub", // Các trang con sẽ hiện: "Trang con | Mandarine Hub"
  },
  description: "The ultimate platform for multi-agent systems, advanced TTS/STS synthesis, and autonomous workflows. Powered by Mandarine OS.",
  keywords: ["AI", "Agents", "Workflow", "Mandarine", "Automation", "LLM", "TTS"],
  authors: [{ name: "Mandarine Team" }],
  creator: "Mandarine Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Mandarine Hub - AI Agent Orchestration",
    description: "Deploy specialized AI workers that collaborate to solve complex tasks autonomously.",
    siteName: "Mandarine Hub",
    images: [
      {
        url: "/og-image.png", // Bạn nên tạo 1 ảnh og-image.png bỏ vào folder public
        width: 1200,
        height: 630,
        alt: "Mandarine Hub Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mandarine Hub",
    description: "Orchestrate Your Digital Workforce with Mandarine OS.",
    images: ["/og-image.png"],
    creator: "@mandarine_hub",
  },
  icons: {
    icon: "/mandarine.svg", // Tự động trỏ tới file icon.tsx chúng ta tạo ở bước 2
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        className={`${fontSans.variable} ${fontDisplay.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Mandarine style hợp với dark hơn
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}