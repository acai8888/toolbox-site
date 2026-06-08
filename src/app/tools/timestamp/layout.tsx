import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "时间戳转换",
  description: "在线Unix时间戳转换工具，支持时间戳与日期互转。",
  keywords: ["时间戳转换", "Unix时间戳", "日期转换"],
  openGraph: {
    title: "时间戳转换 | 万能工具箱",
    description: "在线Unix时间戳转换工具，支持时间戳与日期互转。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
