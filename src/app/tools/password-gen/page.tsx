"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function PasswordGenPage() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generate = useCallback(() => {
    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    const pwd = Array.from(arr, (v) => chars[v % chars.length]).join("");
    setPassword(pwd);
    setHistory((prev) => [pwd, ...prev.slice(0, 4)]);
  }, [length, uppercase, lowercase, numbers, symbols]);

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const strength = password.length === 0 ? 0 : Math.min(4,
    (password.length >= 8 ? 1 : 0) +
    (password.length >= 12 ? 1 : 0) +
    (/[A-Z]/.test(password) && /[a-z]/.test(password) ? 1 : 0) +
    (/[^a-zA-Z0-9]/.test(password) ? 1 : 0)
  );
  const strengthLabels = ["", "弱", "一般", "强", "非常强"];
  const strengthColors = ["", "bg-danger", "bg-accent", "bg-success", "bg-primary"];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">密码生成器</h1>
      <p className="text-muted mb-8">生成安全的随机密码</p>

      {/* Generated Password */}
      <div className="bg-card rounded-2xl p-6 border border-border mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 font-mono text-lg break-all min-h-[28px]">{password || <span className="text-muted">点击生成按钮创建密码</span>}</div>
          <button onClick={handleCopy} className="p-2 rounded-lg bg-card-hover hover:bg-border shrink-0">
            {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
          </button>
          <button onClick={generate} className="p-2 rounded-lg bg-primary text-white hover:bg-primary-hover shrink-0">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        {password && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-muted">强度:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1.5 w-8 rounded-full ${i <= strength ? strengthColors[strength] : "bg-border"}`} />
              ))}
            </div>
            <span className={`text-xs font-medium ${strength >= 3 ? "text-success" : strength >= 2 ? "text-accent" : "text-danger"}`}>
              {strengthLabels[strength]}
            </span>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">密码长度: {length}</label>
          <input type="range" min={4} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "大写字母 (A-Z)", checked: uppercase, set: setUppercase },
            { label: "小写字母 (a-z)", checked: lowercase, set: setLowercase },
            { label: "数字 (0-9)", checked: numbers, set: setNumbers },
            { label: "特殊符号 (!@#$)", checked: symbols, set: setSymbols },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={opt.checked} onChange={(e) => opt.set(e.target.checked)} className="rounded" />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
        <button onClick={generate} className="w-full py-3 rounded-xl bg-primary text-white hover:bg-primary-hover font-medium">
          生成密码
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-3">历史记录</h2>
          <div className="space-y-2">
            {history.map((pwd, i) => (
              <div key={i} className="flex items-center justify-between bg-card rounded-lg px-4 py-2 border border-border">
                <span className="font-mono text-sm truncate">{pwd}</span>
                <button onClick={() => { navigator.clipboard.writeText(pwd); }} className="text-xs text-primary hover:text-primary-hover shrink-0 ml-2">复制</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
