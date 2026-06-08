import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "字数统计",
  description: "在线字数统计工具，统计字符数、词数、段落数等信息。",
  keywords: ["字数统计", "字符统计", "词数统计"],
  openGraph: {
    title: "字数统计 | 万能工具箱",
    description: "在线字数统计工具，统计字符数、词数、段落数等信息。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
