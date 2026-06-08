import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们",
  description: "万能工具箱致力于为用户提供免费、好用的在线工具和优质资源，让每个人都能轻松使用AI工具提升效率。",
  keywords: ["万能工具箱", "关于我们", "在线工具", "免费资源"],
  openGraph: {
    title: "关于我们 | 万能工具箱",
    description: "万能工具箱致力于为用户提供免费、好用的在线工具和优质资源。",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
