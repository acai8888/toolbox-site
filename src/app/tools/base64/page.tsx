"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  let output = "";
  try {
    output = mode === "encode" ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
  } catch {
    output = "⚠️ 输入内容无法" + (mode === "encode" ? "编码" : "解码");
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Base64 编解码</h1>
      <p className="text-muted mb-8">Base64 编码和解码工具</p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("encode")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "encode" ? "bg-primary text-white" : "bg-card border border-border hover:bg-card-hover"}`}
        >
          编码
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "decode" ? "bg-primary text-white" : "bg-card border border-border hover:bg-card-hover"}`}
        >
          解码
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">{mode === "encode" ? "原始文本" : "Base64 字符串"}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "输入要编码的文本..." : "输入要解码的Base64..."}
            rows={10}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">{mode === "encode" ? "Base64 结果" : "解码结果"}</label>
            <button onClick={handleCopy} className="text-xs text-primary hover:text-primary-hover flex items-center gap-1">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "已复制" : "复制"}
            </button>
          </div>
          <pre className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-mono min-h-[240px] whitespace-pre-wrap break-all">{output || <span className="text-muted">结果将显示在这里</span>}</pre>
        </div>
      </div>
    </div>
  );
}
