import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "颜色选择器",
  description: "在线颜色选择器工具，支持HEX、RGB、HSL等颜色格式转换。",
  keywords: ["颜色选择器", "取色器", "颜色转换"],
  openGraph: {
    title: "颜色选择器 | 万能工具箱",
    description: "在线颜色选择器工具，支持HEX、RGB、HSL等颜色格式转换。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
