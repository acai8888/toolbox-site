import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF工具",
  description: "在线PDF处理工具，支持PDF合并、拆分、压缩、转Word。",
  keywords: ["PDF工具", "PDF合并", "PDF压缩"],
  openGraph: {
    title: "PDF工具 | 万能工具箱",
    description: "在线PDF处理工具，支持PDF合并、拆分、压缩、转Word。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
