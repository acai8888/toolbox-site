"use client";

import { useState } from "react";
import { Copy, Check, Trash2, Upload } from "lucide-react";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleJson = `{
  "name": "万能工具箱",
  "version": "1.0.0",
  "tools": ["qrcode", "image-compress", "json-formatter"],
  "author": {
    "name": "Admin",
    "url": "https://example.com"
  }
}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">JSON 格式化</h1>
      <p className="text-muted mb-8">格式化、压缩和验证JSON数据</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">输入 JSON</label>
            <button
              onClick={() => { setInput(sampleJson); setError(""); setOutput(""); }}
              className="text-xs text-primary hover:text-primary-hover"
            >
              加载示例
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='粘贴JSON数据到这里...'
            rows={16}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          />
          <div className="flex gap-2 mt-3">
            <button onClick={format} className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium">
              格式化
            </button>
            <button onClick={minify} className="flex-1 px-4 py-2.5 rounded-lg bg-card border border-border hover:bg-card-hover text-sm font-medium">
              压缩
            </button>
            <button onClick={() => { setInput(""); setOutput(""); setError(""); }} className="px-3 py-2.5 rounded-lg bg-card border border-border hover:bg-card-hover">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <label className="text-xs text-muted">缩进:</label>
            {[2, 4].map((n) => (
              <button
                key={n}
                onClick={() => setIndent(n)}
                className={`px-2 py-1 rounded text-xs ${indent === n ? "bg-primary text-white" : "bg-card border border-border"}`}
              >
                {n}空格
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">输出结果</label>
            {output && (
              <button onClick={handleCopy} className="text-xs text-primary hover:text-primary-hover flex items-center gap-1">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "已复制" : "复制"}
              </button>
            )}
          </div>
          <div className="relative">
            <pre className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-mono overflow-auto min-h-[400px] whitespace-pre-wrap">
              {error ? (
                <span className="text-danger">{error}</span>
              ) : output ? (
                output
              ) : (
                <span className="text-muted">格式化后的JSON将显示在这里</span>
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
