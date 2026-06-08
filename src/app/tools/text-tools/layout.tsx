import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文本处理工具",
  description: "在线文本处理工具集，支持文本去重、排序、替换、统计。",
  keywords: ["文本处理", "文本去重", "文本排序"],
  openGraph: {
    title: "文本处理工具 | 万能工具箱",
    description: "在线文本处理工具集，支持文本去重、排序、替换、统计。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
