"use client";

import { useState, useEffect } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function TimestampPage() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [dateStr, setDateStr] = useState("");
  const [manualTs, setManualTs] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setTimestamp(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timestamp) {
      const d = new Date(timestamp * 1000);
      setDateStr(d.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }));
    }
  }, [timestamp]);

  const tsToDate = () => {
    if (manualTs) {
      const d = new Date(Number(manualTs) * 1000);
      setManualDate(d.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }));
    }
  };

  const dateToTs = () => {
    if (manualDate) {
      const d = new Date(manualDate);
      setManualTs(Math.floor(d.getTime() / 1000).toString());
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const now = new Date();
  const formats = [
    { label: "Unix 时间戳 (秒)", value: Math.floor(now.getTime() / 1000).toString() },
    { label: "Unix 时间戳 (毫秒)", value: now.getTime().toString() },
    { label: "ISO 8601", value: now.toISOString() },
    { label: "本地时间", value: now.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }) },
    { label: "UTC 时间", value: now.toUTCString() },
    { label: "日期", value: now.toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai" }) },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">时间戳转换</h1>
      <p className="text-muted mb-8">Unix时间戳与日期时间互转</p>

      {/* Current Timestamp */}
      <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-6 text-white mb-8">
        <p className="text-sm text-white/70 mb-1">当前时间戳（实时更新）</p>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold font-mono">{timestamp}</span>
          <button
            onClick={() => handleCopy(timestamp.toString(), "ts")}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30"
          >
            {copied === "ts" ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-white/80 mt-2">{dateStr}</p>
      </div>

      {/* Current Formats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {formats.map((f) => (
          <div key={f.label} className="flex items-center justify-between bg-card rounded-xl px-4 py-3 border border-border">
            <div>
              <span className="text-xs text-muted">{f.label}</span>
              <p className="font-mono text-sm">{f.value}</p>
            </div>
            <button onClick={() => handleCopy(f.value, f.label)} className="p-2 rounded-lg hover:bg-card-hover shrink-0">
              {copied === f.label ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted" />}
            </button>
          </div>
        ))}
      </div>

      {/* Converters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timestamp to Date */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="font-bold mb-4">时间戳 → 日期</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={manualTs}
              onChange={(e) => setManualTs(e.target.value)}
              placeholder="输入时间戳..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button onClick={tsToDate} className="px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium">
              转换
            </button>
          </div>
          {manualDate && (
            <div className="bg-background rounded-lg p-3 text-sm font-mono">{manualDate}</div>
          )}
        </div>

        {/* Date to Timestamp */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h2 className="font-bold mb-4">日期 → 时间戳</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={manualDate}
              onChange={(e) => setManualDate(e.target.value)}
              placeholder="输入日期 (如 2024-01-01 12:00:00)"
              className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button onClick={dateToTs} className="px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium">
              转换
            </button>
          </div>
          {manualTs && (
            <div className="bg-background rounded-lg p-3 text-sm font-mono">{manualTs}</div>
          )}
        </div>
      </div>
    </div>
  );
}
