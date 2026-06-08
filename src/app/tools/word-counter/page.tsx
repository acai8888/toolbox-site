"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function WordCounterPage() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = {
    chars: input.length,
    charsNoSpace: input.replace(/\s/g, "").length,
    words: input.trim() ? input.trim().split(/\s+/).length : 0,
    sentences: input.trim() ? input.split(/[.!?。！？]+/).filter(Boolean).length : 0,
    lines: input ? input.split("\n").length : 0,
    paragraphs: input.trim() ? input.trim().split(/\n\s*\n/).length : 0,
    chinese: (input.match(/[\u4e00-\u9fff]/g) || []).length,
    english: (input.match(/[a-zA-Z]/g) || []).length,
    punctuation: (input.match(/[^\w\s\u4e00-\u9fff]/g) || []).length,
    readingTime: Math.max(1, Math.ceil((input.trim() ? input.trim().split(/\s+/).length : 0) / 200)),
  };

  const handleCopy = () => {
    const report = Object.entries(stats).map(([k, v]) => `${k}: ${v}`).join("\n");
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">字数统计</h1>
      <p className="text-muted mb-8">统计字符数、词数、句子数等</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: "总字符数", value: stats.chars, color: "text-primary" },
          { label: "不含空格", value: stats.charsNoSpace, color: "text-primary" },
          { label: "单词数", value: stats.words, color: "text-blue-500" },
          { label: "句子数", value: stats.sentences, color: "text-purple-500" },
          { label: "行数", value: stats.lines, color: "text-green-500" },
          { label: "段落数", value: stats.paragraphs, color: "text-orange-500" },
          { label: "中文字符", value: stats.chinese, color: "text-red-500" },
          { label: "英文字母", value: stats.english, color: "text-cyan-500" },
          { label: "标点符号", value: stats.punctuation, color: "text-amber-500" },
          { label: "阅读时间", value: `${stats.readingTime}分钟`, color: "text-pink-500" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-4 border border-border text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mb-2">
        <button onClick={handleCopy} className="text-xs text-primary hover:text-primary-hover flex items-center gap-1">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "已复制统计" : "复制统计结果"}
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="在此输入或粘贴文本进行统计..."
        rows={12}
        className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
      />
    </div>
  );
}
