import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI音乐生成",
  description: "在线AI音乐生成工具，输入描述即可自动创作音乐。",
  keywords: ["AI音乐", "AI作曲", "音乐生成"],
  openGraph: {
    title: "AI音乐生成 | 万能工具箱",
    description: "在线AI音乐生成工具，输入描述即可自动创作音乐。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
