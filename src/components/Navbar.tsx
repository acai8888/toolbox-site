"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Sparkles, Search, Wrench, Download, User, LogIn, LogOut, Heart } from "lucide-react";
import { useUser } from "@/hooks/useUser";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/tools", label: "在线工具" },
  { href: "/resources", label: "资源下载" },
  { href: "/favorites", label: "我的收藏" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const { user, login, logout } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await login(nameInput)) {
      setShowLogin(false);
      setNameInput("");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 text-lg font-bold flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="gradient-text">万能工具箱</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Area */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-light">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">{user.name}</span>
                  </div>
                  <button onClick={logout} className="p-1.5 rounded-lg hover:bg-card-hover text-muted" title="退出">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-hover text-xs font-medium"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  登录
                </button>
              )}
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-1.5 rounded-lg hover:bg-card-hover">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="md:hidden pb-3 border-t border-border mt-1 pt-3">
              {user ? (
                <div className="flex items-center gap-2 px-3 py-2 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{user.name}</span>
                  <button onClick={logout} className="ml-auto text-xs text-muted">退出</button>
                </div>
              ) : (
                <button onClick={() => setShowLogin(true)} className="flex items-center gap-1.5 px-3 py-2 mb-2 text-primary text-sm">
                  <LogIn className="w-4 h-4" /> 登录
                </button>
              )}
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover">
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setShowLogin(false)}>
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-1">欢迎</h2>
            <p className="text-sm text-muted mb-4">输入昵称即可登录，无需密码</p>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="输入你的昵称..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
              <button type="submit" disabled={!nameInput.trim()} className="w-full py-3 rounded-xl bg-primary text-white hover:bg-primary-hover font-medium disabled:opacity-50">
                登录
              </button>
            </form>
            <button onClick={() => setShowLogin(false)} className="w-full mt-3 py-2 text-sm text-muted hover:text-foreground">
              取消
            </button>
          </div>
        </div>
      )}
    </>
  );
}
