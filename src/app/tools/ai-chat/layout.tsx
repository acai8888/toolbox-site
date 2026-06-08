import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI智能对话",
  description: "在线AI聊天对话工具，支持多轮对话、知识问答。",
  keywords: ["AI对话", "AI聊天", "智能问答"],
  openGraph: {
    title: "AI智能对话 | 万能工具箱",
    description: "在线AI聊天对话工具，支持多轮对话、知识问答。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
