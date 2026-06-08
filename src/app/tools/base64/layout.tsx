import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64编解码",
  description: "在线Base64编码解码工具，支持文本和图片的Base64互转。",
  keywords: ["Base64编码", "Base64解码", "Base64转换"],
  openGraph: {
    title: "Base64编解码 | 万能工具箱",
    description: "在线Base64编码解码工具，支持文本和图片的Base64互转。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
