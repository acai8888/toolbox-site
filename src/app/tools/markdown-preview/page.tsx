"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function MarkdownPreviewPage() {
  const [input, setInput] = useState(`# 万能工具箱

## 功能介绍

这是一站式**在线工具平台**，提供以下功能：

### 在线工具
- 二维码生成
- 图片压缩
- JSON格式化
- 文本处理

### 导航推荐
精选优质网站，分类导航

> 提示：收藏本站，随时使用

\`\`\`json
{
  "name": "万能工具箱",
  "version": "1.0.0"
}
\`\`\`

| 功能 | 状态 |
|------|------|
| 在线工具 | ✅ |
| 导航推荐 | ✅ |
| 资源下载 | ✅ |

---

[访问首页](/)
`);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple markdown to HTML converter
  const renderMarkdown = (md: string): string => {
    return md
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")
      .replace(/^- (.*$)/gm, "<li>$1</li>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/^\|(.+)\|$/gm, (match) => {
        const cells = match.split("|").filter(Boolean).map(c => c.trim());
        if (cells.every(c => /^[-:]+$/.test(c))) return "";
        return `<tr>${cells.map(c => `<td class="border border-border px-3 py-1">${c}</td>`).join("")}</tr>`;
      })
      .replace(/^---$/gm, "<hr class='my-4 border-border'>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Markdown 预览</h1>
      <p className="text-muted mb-8">实时预览 Markdown 内容</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Markdown 编辑器</label>
            <button onClick={handleCopy} className="text-xs text-primary hover:text-primary-hover flex items-center gap-1">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "已复制" : "复制源码"}
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={20}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium mb-2">预览</label>
          <div
            className="w-full px-6 py-4 rounded-xl bg-card border border-border min-h-[480px] prose prose-sm max-w-none overflow-auto"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(input) }}
          />
        </div>
      </div>
    </div>
  );
}
