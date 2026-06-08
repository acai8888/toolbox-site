"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Copy, Check } from "lucide-react";

export default function QRCodePage() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(200);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    const svg = svgRef.current?.querySelector("svg");
    if (svg) {
      const data = new XMLSerializer().serializeToString(svg);
      navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const svg = svgRef.current?.querySelector("svg");
    if (svg) {
      const data = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([data], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.svg";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">二维码生成器</h1>
      <p className="text-muted mb-8">输入文本或网址，生成二维码</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">内容</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入文本或网址..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">尺寸: {size}px</label>
            <input
              type="range"
              min={100}
              max={400}
              step={20}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* QR Code Output */}
        <div className="flex flex-col items-center">
          <div
            ref={svgRef}
            className="bg-white p-6 rounded-2xl shadow-lg mb-4"
          >
            <QRCodeSVG value={text || " "} size={size} />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-card-hover text-sm font-medium"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              {copied ? "已复制" : "复制SVG"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              下载
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
