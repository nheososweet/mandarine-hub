import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

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
  metadataBase: new URL("http://www.nheososweet.me"),
  title: {
    default: "Nheo So Sweet | Fullstack Developer & AI Engineer",
    template: "%s | Nheo So Sweet",
  },
  description:
    "Portfolio của Nguyễn Văn Tân (Nheo So Sweet) - Fullstack Developer & AI Engineer. Chuyên xây dựng các giải pháp công nghệ toàn diện, từ Backend vững chắc đến giao diện Next.js tinh tế và tích hợp AI thông minh.",
  keywords: [
    "Nheo So Sweet",
    "nheososweet",
    "Nguyen Van Tan",
    "Nguyễn Văn Tân",
    "Fullstack Developer",
    "AI Engineer",
    "Next.js Developer",
    "React Developer Vietnam",
    "RAG System",
    "Lập trình viên AI",
    "Web Developer",
  ],
  authors: [{ name: "Nguyen Van Tan", url: "http://www.nheososweet.me" }],
  creator: "Nguyen Van Tan",

  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "http://www.nheososweet.me",
    title: "Nheo So Sweet | Fullstack Developer & AI Engineer",
    description:
      "Khám phá Portfolio của Nguyễn Văn Tân - Kết hợp tư duy sản phẩm Fullstack với sức mạnh của AI & Next.js.",
    siteName: "Nheo So Sweet Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nheo So Sweet Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Nheo So Sweet | Fullstack Developer & AI Engineer",
    description:
      "Portfolio của Nguyễn Văn Tân - Chuyên gia Fullstack & AI Integration.",
    images: ["/og-image.png"],
    creator: "@nheososweet",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// 3. Schema JSON-LD
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nguyen Van Tan",
  alternateName: "Nheo So Sweet",
  url: "http://www.nheososweet.me",
  image: "http://www.nheososweet.me/og-image.png",
  sameAs: [
    "https://github.com/your-github",
    "https://linkedin.com/in/your-linkedin",
    "https://facebook.com/your-facebook",
  ],
  jobTitle: "Fullstack Developer & AI Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Freelance / Open for Work",
  },
  knowsAbout: [
    "Software Development",
    "Fullstack Development",
    "Next.js",
    "Artificial Intelligence",
    "RAG Systems",
    "React",
    "Python",
    "Backend Engineering",
  ],
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
        {/* Inject JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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