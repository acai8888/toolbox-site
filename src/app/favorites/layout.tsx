import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "我的收藏",
  description: "管理你收藏的工具和资源，快速找到常用工具。",
  robots: { index: false, follow: true },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
