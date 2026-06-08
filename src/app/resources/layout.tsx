import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "资源下载",
  description: "精选免费软件、素材和教程资源下载。涵盖AI教程、短视频素材、直播工具包等海量资源，助你快速开启副业之路。",
  keywords: ["资源下载", "免费资源", "软件下载", "AI教程", "短视频素材", "副业资源"],
  openGraph: {
    title: "资源下载 | 万能工具箱",
    description: "精选免费软件、素材和教程资源下载，助你快速开启副业之路。",
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
