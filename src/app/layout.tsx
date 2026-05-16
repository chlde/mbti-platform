import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#7c3aed",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mbti-platform-7h9.pages.dev"),
  title: "MBTI 人格测试 | 发现真实的自己",
  description:
    "28道精选题目，3分钟深度解读你的MBTI人格类型。免费、专业、有趣的性格测试，已有上万人参与。来发现你的真实人格吧！",
  keywords: [
    "MBTI",
    "人格测试",
    "性格测试",
    "十六型人格",
    "MBTI测试",
    "人格类型",
    "心理学",
  ],
  openGraph: {
    title: "MBTI 人格测试 | 发现真实的自己",
    description:
      "28道精选题目，3分钟深度解读你的MBTI人格类型。来遇见真实的自己！",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MBTI 人格测试",
      },
    ],
    type: "website",
    locale: "zh_CN",
    siteName: "MBTI 人格测试",
  },
  twitter: {
    card: "summary_large_image",
    title: "MBTI 人格测试 | 发现真实的自己",
    description:
      "28道精选题目，3分钟深度解读你的MBTI人格类型。来遇见真实的自己！",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head />
      <body className="min-h-screen bg-subtle-warm">
        {/* Subtle decorative blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-40 w-96 h-96 bg-pink-300/15 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-0 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl" />
        </div>

        {children}
      </body>
    </html>
  );
}
