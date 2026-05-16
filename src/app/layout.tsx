import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MBTI 性格测试",
  description: "探索你的 MBTI 人格类型",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
