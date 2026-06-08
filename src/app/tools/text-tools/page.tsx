"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function TextToolsPage() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState("");

  const stats = {
    chars: input.length,
    charsNoSpace: input.replace(/\s/g, "").length,
    words: input.trim() ? input.trim().split(/\s+/).length : 0,
    lines: input ? input.split("\n").length : 0,
    paragraphs: input.trim() ? input.trim().split(/\n\s*\n/).length : 0,
    chinese: (input.match(/[\u4e00-\u9fff]/g) || []).length,
    english: (input.match(/[a-zA-Z]/g) || []).length,
    numbers: (input.match(/\d/g) || []).length,
  };

  const upper = input.toUpperCase();
  const lower = input.toLowerCase();
  const capitalize = input.replace(/\b\w/g, (c) => c.toUpperCase());
  const reverse = input.split("").reverse().join("");
  const removeDuplicates = [...new Set(input.split("\n"))].join("\n");
  const sortLines = input.split("\n").sort().join("\n");
  const trimLines = input.split("\n").map((l) => l.trim()).join("\n");

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">文本处理工具</h1>
      <p className="text-muted mb-8">字数统计、大小写转换、去重、排序等</p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "总字符", value: stats.chars },
          { label: "不含空格", value: stats.charsNoSpace },
          { label: "单词数", value: stats.words },
          { label: "行数", value: stats.lines },
          { label: "段落数", value: stats.paragraphs },
          { label: "中文字符", value: stats.chinese },
          { label: "英文字母", value: stats.english },
          { label: "数字", value: stats.numbers },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-3 border border-border text-center">
            <div className="text-2xl font-bold text-primary">{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入或粘贴文本..."
        rows={8}
        className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none mb-6"
      />

      {/* Transform Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[
          { label: "全部大写", value: upper },
          { label: "全部小写", value: lower },
          { label: "首字母大写", value: capitalize },
          { label: "文本反转", value: reverse },
          { label: "去除重复行", value: removeDuplicates },
          { label: "行排序", value: sortLines },
          { label: "去除首尾空格", value: trimLines },
        ].map((t) => (
          <button
            key={t.label}
            onClick={() => handleCopy(t.value, t.label)}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border hover:bg-card-hover text-sm font-medium"
          >
            {t.label}
            {copied === t.label ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4 text-muted" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
