import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "图片压缩",
  description: "在线图片压缩工具，支持JPG、PNG、WebP等格式，智能压缩保持画质。",
  keywords: ["图片压缩", "图片优化", "压缩图片"],
  openGraph: {
    title: "图片压缩 | 万能工具箱",
    description: "在线图片压缩工具，支持JPG、PNG、WebP等格式，智能压缩保持画质。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
