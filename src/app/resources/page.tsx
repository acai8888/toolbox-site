"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Download,
  Search,
  ExternalLink,
  Package,
  ChevronDown,
  Star,
  MessageCircle,
  Send,
  LogIn,
} from "lucide-react";
import { useReviews, Review } from "@/hooks/useReviews";
import { useUser } from "@/hooks/useUser";

interface DownloadLink {
  platform: string;
  url: string;
  extractCode?: string;
}

interface Resource {
  id: string;
  name: string;
  version: string;
  releaseDate: string;
  description: string;
  category: string;
  tags: string[];
  platforms: string[];
  icon?: string;
  downloadLinks: DownloadLink[];
  isActive: boolean;
}

const PLATFORM_ICONS: Record<string, string> = {
  Windows: "\uD83D\uDCBB",
  macOS: "\uD83C\uDF4E",
  Linux: "\uD83D\uDC27",
  "\u5168\u5E73\u53F0": "\uD83C\uDF10",
};

const NETDISK_ICONS: Record<string, string> = {
  "\u5938\u514B\u7F51\u76D8": "\uD83D\uDD35",
  "\u8FC5\u96F7\u7F51\u76D8": "\uD83D\uDFE0",
  "UC\u7F51\u76D8": "\uD83D\uDFE1",
  "\u767E\u5EA6\u7F51\u76D8": "\uD83D\uDD37",
  "\u84DD\u594F\u4E91": "\uD83D\uDFE2",
  "123\u4E91\u76D8": "\uD83D\uDFE3",
  "\u5176\u4ED6": "\uD83D\uDD17",
};

// ===== Star Rating Display =====
function StarRating({
  rating,
  size = "w-4 h-4",
  interactive = false,
  onRate,
}: {
  rating: number;
  size?: string;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(i)}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        >
          <Star
            className={`${size} ${
              i <= (hover || rating)
                ? "fill-accent text-accent"
                : "fill-transparent text-border"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ===== Rating Distribution Bar =====
function RatingDistribution({ reviews }: { reviews: Review[] }) {
  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // index 0 = 5 stars, index 4 = 1 star
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) counts[5 - r.rating]++;
    });
    return counts;
  }, [reviews]);

  const total = reviews.length || 1;

  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[5 - star];
        const pct = (count / total) * 100;
        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="w-8 text-right text-muted shrink-0">{star} 星</span>
            <div className="flex-1 h-2.5 rounded-full bg-border/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-8 text-right text-muted text-xs shrink-0">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ===== Review Item =====
function ReviewItem({ review }: { review: Review }) {
  const initial = review.userName.charAt(0).toUpperCase();
  const timeStr = new Date(review.createdAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex gap-3 py-4 border-b border-border last:border-b-0">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0">
        {initial}
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{review.userName}</span>
          <StarRating rating={review.rating} size="w-3 h-3" />
          <span className="text-xs text-muted ml-auto">{timeStr}</span>
        </div>
        <p className="text-sm text-muted mt-1.5 leading-relaxed break-words">
          {review.content}
        </p>
      </div>
    </div>
  );
}

// ===== Review Section =====
function ReviewSection() {
  const { user, loading: userLoading } = useUser();
  const [selectedResourceId, setSelectedResourceId] = useState<string>("");
  const [selectedResourceName, setSelectedResourceName] = useState<string>("");
  const [commentText, setCommentText] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    reviews,
    rating,
    loading: reviewsLoading,
    submit,
  } = useReviews(selectedResourceId, "resource");

  const handleSubmit = async () => {
    if (!user || !selectedResourceId || selectedRating === 0 || !commentText.trim())
      return;
    setSubmitting(true);
    setSubmitSuccess(false);
    const ok = await submit(
      user.id,
      user.name,
      selectedRating,
      commentText.trim()
    );
    setSubmitting(false);
    if (ok) {
      setCommentText("");
      setSelectedRating(0);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }
  };

  return (
    <div className="mt-16">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">用户评价</h2>
        {rating.count > 0 && (
          <div className="flex items-center gap-2 ml-2">
            <span className="text-accent font-bold text-lg">
              {rating.avg.toFixed(1)}
            </span>
            <StarRating rating={Math.round(rating.avg)} size="w-4 h-4" />
            <span className="text-sm text-muted">({rating.count} 条评价)</span>
          </div>
        )}
      </div>

      {/* Resource Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-muted mb-2">
          选择要评价的资源
        </label>
        <select
          value={selectedResourceId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedResourceId(id);
            const opt = e.target.selectedOptions[0];
            setSelectedResourceName(
              opt ? opt.getAttribute("data-name") || "" : ""
            );
          }}
          className="w-full max-w-md px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        >
          <option value="">-- 请选择资源 --</option>
          <ResourceOptions />
        </select>
      </div>

      {/* Rating Summary + Distribution */}
      {selectedResourceId && rating.count > 0 && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Average Score */}
            <div className="flex flex-col items-center justify-center sm:min-w-[120px]">
              <span className="text-4xl font-bold text-accent">
                {rating.avg.toFixed(1)}
              </span>
              <StarRating rating={Math.round(rating.avg)} size="w-5 h-5" />
              <span className="text-sm text-muted mt-1">
                {rating.count} 条评价
              </span>
            </div>
            {/* Distribution */}
            <div className="flex-1">
              <RatingDistribution reviews={reviews} />
            </div>
          </div>
        </div>
      )}

      {/* Comment Form */}
      {selectedResourceId && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          {user ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-sm">{user.name}</span>
              </div>

              {/* Star Selector */}
              <div className="mb-4">
                <label className="block text-sm text-muted mb-2">
                  评分
                </label>
                <StarRating
                  rating={selectedRating}
                  size="w-6 h-6"
                  interactive
                  onRate={setSelectedRating}
                />
              </div>

              {/* Comment Input */}
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="分享你的使用体验..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />

              {/* Actions */}
              <div className="flex items-center justify-between mt-3">
                {submitSuccess && (
                  <span className="text-sm text-success font-medium">
                    评论发表成功!
                  </span>
                )}
                {!submitSuccess && <span />}
                <button
                  onClick={handleSubmit}
                  disabled={
                    submitting ||
                    selectedRating === 0 ||
                    !commentText.trim()
                  }
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "提交中..." : "发表评论"}
                </button>
              </div>
            </>
          ) : (
            !userLoading && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <LogIn className="w-10 h-10 text-muted mb-3 opacity-50" />
                <p className="text-muted text-sm">登录后即可评论</p>
                <p className="text-muted text-xs mt-1">
                  请先在页面右上角登录
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* Reviews List */}
      {selectedResourceId && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-base mb-2">全部评论</h3>
          {reviewsLoading ? (
            <div className="text-center py-8 text-muted">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-50 animate-pulse" />
              <p className="text-sm">加载评论中...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">暂无评论，快来发表第一条评价吧</p>
            </div>
          ) : (
            <div>
              {reviews.map((r) => (
                <ReviewItem key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* No resource selected hint */}
      {!selectedResourceId && (
        <div className="text-center py-12 text-muted">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">请先选择一个资源查看和发表评价</p>
        </div>
      )}
    </div>
  );
}

// ===== Resource Options (fetches resources from API) =====
function ResourceOptions() {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    fetch("/api/resources")
      .then((res) => res.json())
      .then((data) => {
        setResources(
          (data.resources || []).filter((r: Resource) => r.isActive)
        );
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {resources.map((r) => (
        <option key={r.id} value={r.id} data-name={r.name}>
          {r.icon || "\uD83D\uDCE6"} {r.name} {r.version ? `v${r.version}` : ""}
        </option>
      ))}
    </>
  );
}

// ===== Main Page =====
export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<string[]>(["\u5168\u90E8"]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("\u5168\u90E8");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/resources")
      .then((res) => res.json())
      .then((data) => {
        setResources((data.resources || []).filter((r: Resource) => r.isActive));
        setCategories(data.categories || ["\u5168\u90E8"]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = resources.filter((r) => {
    const matchCat = activeCat === "\u5168\u90E8" || r.category === activeCat;
    const matchSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">资源下载</h1>
        <p className="text-muted mt-2">精选免费软件、素材和教程资源</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="搜索资源..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCat === cat
                  ? "bg-primary text-white"
                  : "bg-card border border-border hover:bg-card-hover"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      {loading ? (
        <div className="text-center py-16 text-muted">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50 animate-pulse" />
          <p>加载中...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>没有找到匹配的资源</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="tool-card bg-card rounded-xl border border-border hover:border-primary/50 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{r.icon || "\uD83D\uDCE6"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base truncate">
                        {r.name}
                      </h3>
                      {r.version && (
                        <span className="text-xs text-muted shrink-0">
                          v{r.version}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted mt-1 line-clamp-2">
                      {r.description}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap mt-3">
                  {r.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-primary-light text-primary font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Platforms */}
                <div className="flex items-center gap-2 mt-3 text-xs text-muted">
                  {r.platforms.map((p) => (
                    <span key={p}>{PLATFORM_ICONS[p] || p}</span>
                  ))}
                  <span className="ml-auto">
                    {r.releaseDate &&
                      new Date(r.releaseDate).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </div>

              {/* Download Links Area */}
              <div className="border-t border-border bg-background/50 px-5 py-3">
                {r.downloadLinks.length === 1 ? (
                  /* Single link: show button directly */
                  <a
                    href={r.downloadLinks[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    {r.downloadLinks[0].platform} 下载
                    {r.downloadLinks[0].extractCode && (
                      <span className="text-white/70 text-xs ml-1">
                        提取码: {r.downloadLinks[0].extractCode}
                      </span>
                    )}
                  </a>
                ) : r.downloadLinks.length > 1 ? (
                  /* Multiple links */
                  expandedId === r.id ? (
                    <div className="space-y-2">
                      {r.downloadLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 w-full py-2 px-3 rounded-lg bg-card border border-border hover:bg-card-hover text-sm group"
                        >
                          <span>
                            {NETDISK_ICONS[link.platform] || "\uD83D\uDD17"}
                          </span>
                          <span className="flex-1 font-medium group-hover:text-primary transition-colors">
                            {link.platform}
                          </span>
                          {link.extractCode && (
                            <span className="text-xs text-muted">
                              提取码: {link.extractCode}
                            </span>
                          )}
                          <ExternalLink className="w-3 h-3 text-muted group-hover:text-primary" />
                        </a>
                      ))}
                      <button
                        onClick={() => setExpandedId(null)}
                        className="w-full py-1.5 text-xs text-muted hover:text-foreground"
                      >
                        收起
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpandedId(r.id)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      下载 ({r.downloadLinks.length}个网盘)
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  )
                ) : (
                  <p className="text-xs text-muted text-center">暂无下载链接</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Section */}
      <ReviewSection />
    </div>
  );
}
