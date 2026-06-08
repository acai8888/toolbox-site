import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI编程助手",
  description: "在线AI编程助手，智能代码补全、Bug修复、代码解释。",
  keywords: ["AI编程", "代码助手", "智能编程"],
  openGraph: {
    title: "AI编程助手 | 万能工具箱",
    description: "在线AI编程助手，智能代码补全、Bug修复、代码解释。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
