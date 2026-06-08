import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown预览",
  description: "在线Markdown编辑预览工具，实时渲染，支持导出HTML。",
  keywords: ["Markdown预览", "Markdown编辑器"],
  openGraph: {
    title: "Markdown预览 | 万能工具箱",
    description: "在线Markdown编辑预览工具，实时渲染，支持导出HTML。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
