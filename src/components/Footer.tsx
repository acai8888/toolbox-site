import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-sm font-bold">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="gradient-text">万能工具箱</span>
          </Link>
          <div className="flex items-center gap-4 text-xs text-muted">
            <Link href="/tools" className="hover:text-primary transition-colors">在线工具</Link>
            <Link href="/resources" className="hover:text-primary transition-colors">资源下载</Link>
            <Link href="/nav" className="hover:text-primary transition-colors">导航推荐</Link>
          </div>
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} 万能工具箱
          </p>
        </div>
      </div>
    </footer>
  );
}
