import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI绘画生成",
  description: "在线AI绘画工具，文字描述即可生成精美图片。",
  keywords: ["AI绘画", "AI画图", "文字生图"],
  openGraph: {
    title: "AI绘画生成 | 万能工具箱",
    description: "在线AI绘画工具，文字描述即可生成精美图片。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
