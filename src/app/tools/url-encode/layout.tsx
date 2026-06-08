import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL编解码",
  description: "在线URL编码解码工具，快速对URL进行编码和解码操作。",
  keywords: ["URL编码", "URL解码", "URLencode"],
  openGraph: {
    title: "URL编解码 | 万能工具箱",
    description: "在线URL编码解码工具，快速对URL进行编码和解码操作。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
