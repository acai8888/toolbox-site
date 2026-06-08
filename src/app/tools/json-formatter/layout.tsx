import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON格式化",
  description: "在线JSON格式化美化工具，支持JSON校验、压缩、树形展示。",
  keywords: ["JSON格式化", "JSON美化", "JSON校验"],
  openGraph: {
    title: "JSON格式化 | 万能工具箱",
    description: "在线JSON格式化美化工具，支持JSON校验、压缩、树形展示。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
