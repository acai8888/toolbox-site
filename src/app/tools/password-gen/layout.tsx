import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "密码生成器",
  description: "在线随机密码生成器，支持自定义长度和字符类型。",
  keywords: ["密码生成器", "随机密码", "安全密码"],
  openGraph: {
    title: "密码生成器 | 万能工具箱",
    description: "在线随机密码生成器，支持自定义长度和字符类型。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
