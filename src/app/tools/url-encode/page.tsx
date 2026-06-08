"use client";

import { useState } from "react";
import { Copy, Check, ArrowDown } from "lucide-react";

export default function UrlEncodePage() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState("");

  const encoded = encodeURIComponent(input);
  const decoded = input.includes("%") ? decodeURIComponent(input) : "";

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">URL 编码/解码</h1>
      <p className="text-muted mb-8">对URL进行编码和解码</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">输入文本</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入需要编码或解码的文本..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-6 h-6 text-muted" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">编码结果</label>
            <button onClick={() => handleCopy(encoded, "enc")} className="text-xs text-primary hover:text-primary-hover flex items-center gap-1">
              {copied === "enc" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied === "enc" ? "已复制" : "复制"}
            </button>
          </div>
          <pre className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-mono min-h-[80px] whitespace-pre-wrap break-all">{encoded || <span className="text-muted">编码结果将显示在这里</span>}</pre>
        </div>

        {decoded && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">解码结果</label>
              <button onClick={() => handleCopy(decoded, "dec")} className="text-xs text-primary hover:text-primary-hover flex items-center gap-1">
                {copied === "dec" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied === "dec" ? "已复制" : "复制"}
              </button>
            </div>
            <pre className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-mono min-h-[80px] whitespace-pre-wrap">{decoded}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
