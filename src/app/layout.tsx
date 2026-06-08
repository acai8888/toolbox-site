import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "万能工具箱 - 在线工具·导航推荐·资源分发",
    template: "%s | 万能工具箱",
  },
  description: "一站式在线工具平台，提供二维码生成、图片压缩、JSON格式化、文本处理等实用工具，精选优质网站导航，免费资源下载分发。",
  keywords: ["在线工具", "免费工具", "工具箱", "二维码生成", "图片压缩", "JSON格式化", "网站导航", "资源下载", "Base64", "时间戳"],
  authors: [{ name: "万能工具箱" }],
  metadataBase: new URL("https://tools.fuye.qzz.io"),
  alternates: {
    canonical: "https://tools.fuye.qzz.io",
  },
  openGraph: {
    title: "万能工具箱 - 在线工具·导航推荐·资源分发",
    description: "一站式在线工具平台，提供多种实用在线工具、优质网站导航和免费资源下载。",
    type: "website",
    locale: "zh_CN",
    url: "https://tools.fuye.qzz.io",
    siteName: "万能工具箱",
  },
  twitter: {
    card: "summary_large_image",
    title: "万能工具箱 - 在线工具·导航推荐·资源分发",
    description: "一站式在线工具平台，提供多种实用在线工具、优质网站导航和免费资源下载。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1599694653131171" crossOrigin="anonymous"></script>
      </head>
      <body className="min-h-full flex flex-col">
        <StructuredData />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
