import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "在线工具",
  description: "免费在线工具大全，无需安装打开即用。提供二维码生成、JSON格式化、图片压缩、Base64编解码、时间戳转换等数十种实用工具。",
  keywords: ["在线工具", "免费工具", "二维码生成", "JSON格式化", "图片压缩", "Base64", "时间戳转换", "密码生成"],
  openGraph: {
    title: "在线工具 | 万能工具箱",
    description: "免费在线工具大全，无需安装打开即用。数十种实用工具等你来用。",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
