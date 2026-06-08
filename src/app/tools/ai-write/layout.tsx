import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI写作助手",
  description: "在线AI写作工具，智能生成文章、文案、邮件等内容。",
  keywords: ["AI写作", "智能写作", "文案生成"],
  openGraph: {
    title: "AI写作助手 | 万能工具箱",
    description: "在线AI写作工具，智能生成文章、文案、邮件等内容。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
