import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "临时邮箱",
  description: "在线临时邮箱工具，快速生成一次性邮箱地址，保护隐私。",
  keywords: ["临时邮箱", "一次性邮箱", "匿名邮箱"],
  openGraph: {
    title: "临时邮箱 | 万能工具箱",
    description: "在线临时邮箱工具，快速生成一次性邮箱地址，保护隐私。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
