import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "格式转换器",
  description: "在线文件格式转换工具，支持图片、文档等多种格式互转。",
  keywords: ["格式转换", "文件转换", "图片转换"],
  openGraph: {
    title: "格式转换器 | 万能工具箱",
    description: "在线文件格式转换工具，支持图片、文档等多种格式互转。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
