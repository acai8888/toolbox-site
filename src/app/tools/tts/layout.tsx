import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文字转语音",
  description: "在线文字转语音TTS工具，支持多种语言和声音。",
  keywords: ["文字转语音", "TTS", "语音合成"],
  openGraph: {
    title: "文字转语音 | 万能工具箱",
    description: "在线文字转语音TTS工具，支持多种语言和声音。",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
