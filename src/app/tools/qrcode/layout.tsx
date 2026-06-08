import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "二维码生成器",
  description: "在线二维码生成器，支持文本、网址、WiFi等类型，自定义颜色和大小。",
  keywords: ["二维码生成", "QR码", "二维码工具"],
  openGraph: {
    title: "二维码生成器 | 万能工具箱",
    description: "在线二维码生成器，支持文本、网址、WiFi等类型，自定义颜色和大小。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
