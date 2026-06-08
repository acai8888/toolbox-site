"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { homeCategories, announcements } from "@/data/tools";
import AdBanner from "@/components/AdBanner";
import {
  Search,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Clock,
  Heart,
  Send,
  MessageSquare,
  Info,
  ChevronRight,
  Flame,
  Megaphone,
  Users,
  Zap,
} from "lucide-react";

// ===== 类型定义 =====
interface PopularTool {
  name: string;
  count: number;
  trend: "up" | "down" | "stable";
}

interface Review {
  id: number;
  username: string;
  rating: number;
  content: string;
  time: string;
}

// ===== 默认数据 =====
const defaultPopularTools: PopularTool[] = [
  { name: "AI写作", count: 1286, trend: "up" },
  { name: "图片压缩", count: 1023, trend: "up" },
  { name: "JSON格式化", count: 956, trend: "stable" },
  { name: "二维码生成", count: 842, trend: "down" },
  { name: "AI对话", count: 798, trend: "up" },
  { name: "PDF工具", count: 756, trend: "up" },
  { name: "密码生成器", count: 634, trend: "stable" },
  { name: "颜色工具", count: 521, trend: "down" },
];

const defaultReviews: Review[] = [
  {
    id: 1,
    username: "设计师小王",
    rating: 5,
    content: "AI绘画工具太好用了，生成的图片质量非常高，直接用于商业项目都没问题！",
    time: "2小时前",
  },
  {
    id: 2,
    username: "程序员阿杰",
    rating: 4,
    content: "JSON格式化和Base64编解码工具是我每天都会用的，响应速度很快，界面也很干净。",
    time: "5小时前",
  },
  {
    id: 3,
    username: "内容创作者",
    rating: 5,
    content: "AI写作功能简直是神器，写文案效率提升了10倍，强烈推荐给所有做内容的朋友。",
    time: "1天前",
  },
  {
    id: 4,
    username: "学生小李",
    rating: 4,
    content: "资源库里的软件都很实用，下载速度也快，而且都是免费的，学生党福音！",
    time: "2天前",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [popularTools, setPopularTools] = useState<PopularTool[]>(defaultPopularTools);
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);

  const filteredCategories = homeCategories.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  // 获取热门工具数据
  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => {
        if (data.popular && data.popular.length > 0) {
          setPopularTools(
            data.popular.slice(0, 8).map((item: { name: string; count: number }, index: number) => ({
              name: item.name,
              count: item.count,
              trend: index < 3 ? "up" : index < 6 ? "stable" : "down",
            }))
          );
        }
      })
      .catch(() => {
        // 使用默认数据
      });
  }, []);

  // 获取评论数据
  useEffect(() => {
    fetch("/api/reviews?toolId=all&toolType=general")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews && data.reviews.length > 0) {
          setReviews(
            data.reviews.slice(0, 5).map((r: { username: string; rating: number; content: string; createdAt: string }, i: number) => ({
              id: i + 1,
              username: r.username,
              rating: r.rating,
              content: r.content,
              time: r.createdAt ? new Date(r.createdAt).toLocaleDateString("zh-CN") : "最近",
            }))
          );
        }
      })
      .catch(() => {
        // 使用默认数据
      });
  }, []);

  return (
    <div className="min-h-full">
      {/* 顶部标题栏 */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="gradient-text">万能工具箱</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted max-w-xl mx-auto">
              一站式在线工具平台 — AI工具 · 效率工具 · 素材资源 · 资源导航
            </p>
            {/* 搜索框 */}
            <div className="mt-5 max-w-lg mx-auto relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索工具、资源..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 广告位 - 标题下方 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner slot="home-top" format="horizontal" />
      </div>

      {/* 四栏分类矩阵 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {filteredCategories.map((cat) => (
            <CategoryColumn key={cat.id} category={cat} />
          ))}
        </div>

        {/* 搜索无结果提示 */}
        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted text-lg">未找到匹配 &quot;{searchQuery}&quot; 的工具或资源</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 text-sm text-primary hover:text-primary-hover"
            >
              清除搜索
            </button>
          </div>
        )}
      </section>

      {/* ===== 差异化模块区域 ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-10">

        {/* 广告位 - 内容中间 */}
        <AdBanner slot="home-mid" format="horizontal" />

        {/* 模块A: 热门工具排行 */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold">本周热门</h2>
            <span className="text-xs text-muted bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full">
              实时更新
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {popularTools.map((tool, index) => (
              <PopularToolCard key={tool.name} tool={tool} rank={index + 1} />
            ))}
          </div>
        </section>

        {/* 模块B: 最近更新/公告区 + 模块C: 社区动态 (并排布局) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 模块B: 最近更新 */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Megaphone className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold">最近更新</h2>
            </div>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="divide-y divide-border/50">
                {announcements.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 px-5 py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">{item.date.slice(5)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold truncate">{item.title}</h3>
                      <p className="text-xs text-muted mt-0.5 line-clamp-1">{item.content}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted flex-shrink-0 mt-1" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 模块C: 社区动态 */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold">社区动态</h2>
              <span className="text-xs text-muted bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                最新评论
              </span>
            </div>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="divide-y divide-border/50">
                {reviews.map((review) => (
                  <div key={review.id} className="px-5 py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold text-primary">
                          {review.username.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{review.username}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted">{review.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted leading-relaxed line-clamp-2">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* 模块D: 快捷入口区 */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold">快捷入口</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/favorites"
              className="group bg-card rounded-xl border border-border p-5 flex flex-col items-center gap-3 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-sm font-medium">我的收藏</span>
            </Link>
            <Link
              href="/submit"
              className="group bg-card rounded-xl border border-border p-5 flex flex-col items-center gap-3 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Send className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm font-medium">提交工具</span>
            </Link>
            <Link
              href="/feedback"
              className="group bg-card rounded-xl border border-border p-5 flex flex-col items-center gap-3 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-sm font-medium">意见反馈</span>
            </Link>
            <Link
              href="/about"
              className="group bg-card rounded-xl border border-border p-5 flex flex-col items-center gap-3 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Info className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-sm font-medium">关于我们</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

// ===== 热门工具排行卡片 =====
function PopularToolCard({ tool, rank }: { tool: PopularTool; rank: number }) {
  const rankColors: Record<number, string> = {
    1: "bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-yellow-200 dark:shadow-yellow-900/50",
    2: "bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-gray-200 dark:shadow-gray-700/50",
    3: "bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-amber-200 dark:shadow-amber-900/50",
  };

  const TrendIcon =
    tool.trend === "up" ? TrendingUp : tool.trend === "down" ? TrendingDown : Minus;
  const trendColor =
    tool.trend === "up"
      ? "text-green-500"
      : tool.trend === "down"
      ? "text-red-500"
      : "text-gray-400";

  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 hover:shadow-md transition-all group">
      {/* 排名徽章 */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          rankColors[rank] || "bg-muted text-muted-foreground"
        }`}
      >
        {rank}
      </div>
      {/* 工具信息 */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
          {tool.name}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-muted">{tool.count.toLocaleString()} 次使用</span>
          <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
        </div>
      </div>
    </div>
  );
}

// ===== 分类列组件 =====
function CategoryColumn({ category }: { category: (typeof homeCategories)[number] }) {
  return (
    <div className={`bg-card rounded-xl border ${category.borderColor} overflow-hidden`}>
      {/* 分类头部 */}
      <div className={`bg-gradient-to-r ${category.color} px-4 py-3`}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{category.icon}</span>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">{category.name}</h2>
            <p className="text-white/70 text-xs">{category.subtitle}</p>
          </div>
          <span className="ml-auto text-xs text-white/60 bg-white/15 px-2 py-0.5 rounded-full">
            {category.items.length}
          </span>
        </div>
      </div>

      {/* 工具列表 */}
      <div className="divide-y divide-border/50">
        {category.items.map((item) => (
          <CategoryItem key={item.name} item={item} hoverBg={category.hoverBg} />
        ))}
      </div>
    </div>
  );
}

// ===== 分类项组件 =====
function CategoryItem({
  item,
  hoverBg,
}: {
  item: (typeof homeCategories)[number]["items"][number];
  hoverBg: string;
}) {
  const content = (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 cursor-pointer transition-colors ${hoverBg}`}>
      <span className="text-base flex-shrink-0 w-6 text-center">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{item.name}</div>
        <div className="text-xs text-muted truncate">{item.description}</div>
      </div>
      {item.isExternal ? (
        <ExternalLink className="w-3.5 h-3.5 text-muted flex-shrink-0" />
      ) : (
        <ArrowRight className="w-3.5 h-3.5 text-muted flex-shrink-0" />
      )}
    </div>
  );

  if (item.isExternal) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return <Link href={item.href}>{content}</Link>;
}
