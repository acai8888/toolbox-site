"use client";

import { useState, useEffect } from "react";
import { Copy, Check, RefreshCw, Clock, Mail } from "lucide-react";

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  date: string;
}

export default function TempMailPage() {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Generate a random email
  const generateEmail = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const name = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setEmail(`${name}@tmpbox.example.com`);
    setEmails([]);
  };

  useEffect(() => {
    generateEmail();
  }, []);

  // Simulate email check countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const checkEmails = () => {
    setLoading(true);
    setCountdown(10);
    // Simulate checking
    setTimeout(() => {
      setEmails([
        {
          id: "1",
          from: "noreply@example.com",
          subject: "您的验证码是 123456",
          body: "尊敬的用户，您的验证码是 123456，有效期5分钟。",
          date: new Date().toLocaleString("zh-CN"),
        },
      ]);
      setLoading(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">临时邮箱</h1>
      <p className="text-muted mb-8">一次性临时邮箱，保护您的隐私</p>

      {/* Email Display */}
      <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Mail className="w-5 h-5" />
          <span className="text-sm text-white/70">您的临时邮箱地址</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-mono font-bold flex-1 break-all">{email}</span>
          <button onClick={handleCopy} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 shrink-0">
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
          <button onClick={generateEmail} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-white/60 mt-2">此邮箱将在24小时后自动过期</p>
      </div>

      {/* Check Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={checkEmails}
          disabled={loading || countdown > 0}
          className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary-hover font-medium disabled:opacity-50"
        >
          {loading ? "检查中..." : countdown > 0 ? `${countdown}s 后可再次检查` : "检查邮件"}
        </button>
        {countdown > 0 && <Clock className="w-4 h-4 text-muted" />}
      </div>

      {/* Emails */}
      <div className="space-y-3">
        {emails.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无邮件</p>
            <p className="text-sm mt-1">使用此邮箱注册网站后，点击"检查邮件"查看</p>
          </div>
        ) : (
          emails.map((mail) => (
            <div key={mail.id} className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{mail.from}</span>
                <span className="text-xs text-muted">{mail.date}</span>
              </div>
              <h3 className="font-semibold mb-2">{mail.subject}</h3>
              <p className="text-sm text-muted">{mail.body}</p>
            </div>
          ))
        )}
      </div>

      {/* Notice */}
      <div className="mt-8 bg-accent/10 rounded-xl p-4 border border-accent/20">
        <p className="text-sm text-accent font-medium">注意：这是演示功能</p>
        <p className="text-xs text-muted mt-1">
          正式上线时可接入真实的临时邮箱API服务（如 mail.tm、guerrillamail 等）。
          此演示仅展示UI效果，不会真正接收邮件。
        </p>
      </div>
    </div>
  );
}
