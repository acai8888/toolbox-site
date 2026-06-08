import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "网站导航",
  description: "精选优质网站导航推荐，涵盖AI工具、设计素材、开发资源、学习平台等分类，一站式发现好网站。",
  keywords: ["网站导航", "导航推荐", "AI工具", "设计素材", "开发资源", "学习平台"],
  openGraph: {
    title: "网站导航 | 万能工具箱",
    description: "精选优质网站导航推荐，一站式发现好网站。",
  },
};

export default function NavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
