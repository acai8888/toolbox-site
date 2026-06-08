import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI视频生成",
  description: "在线AI视频生成工具，快速创建创意视频内容。",
  keywords: ["AI视频", "视频生成", "AI剪辑"],
  openGraph: {
    title: "AI视频生成 | 万能工具箱",
    description: "在线AI视频生成工具，快速创建创意视频内容。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
