import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "万能工具箱隐私政策，了解我们如何收集、使用和保护您的个人信息。",
  robots: { index: false, follow: true },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
