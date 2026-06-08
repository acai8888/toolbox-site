"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Heart, Trash2, LogIn, Package, ExternalLink } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { quickTools, resources, type Tool } from "@/data/tools";

interface FavoriteItem {
  id: string;
  userId: string;
  toolId: string;
  toolType: string;
  createdAt: string;
}

export default function FavoritesPage() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载收藏列表
  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/favorites?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // 取消收藏
  const handleRemove = useCallback(
    async (toolId: string) => {
      if (!user) return;
      try {
        await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, toolId }),
        });
        setFavorites((prev) => prev.filter((f) => f.toolId !== toolId));
      } catch {
        // ignore
      }
    },
    [user]
  );

  // 查找工具信息
  const getToolInfo = (toolId: string, toolType: string) => {
    if (toolType === "tool") {
      return quickTools.find((t) => t.id === toolId) as Tool | undefined;
    }
    if (toolType === "resource") {
      return resources.find((r) => r.id === toolId);
    }
    return null;
  };

  // 按类型分组
  const toolFavorites = favorites.filter((f) => f.toolType === "tool");
  const resourceFavorites = favorites.filter((f) => f.toolType === "resource");

  // 未登录状态
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">我的收藏</h1>
          <p className="text-muted mb-6">登录后即可查看和管理你的收藏</p>
          <p className="text-sm text-muted">请点击右上角登录按钮进行登录</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">我的收藏</h1>
        <p className="text-muted mt-2">管理你收藏的工具和资源</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">暂无收藏</h2>
          <p className="text-muted mb-6">去工具列表页浏览并收藏你喜欢的工具吧</p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-sm font-medium"
          >
            浏览工具
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {/* 收藏的工具 */}
          {toolFavorites.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                收藏的工具
                <span className="text-sm font-normal text-muted">({toolFavorites.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {toolFavorites.map((fav) => {
                  const tool = getToolInfo(fav.toolId, fav.toolType);
                  if (!tool || !("href" in tool)) return null;
                  return (
                    <div
                      key={fav.toolId}
                      className="bg-card rounded-xl p-5 border border-border hover:border-primary/50 group relative transition-all duration-200 hover:shadow-md"
                    >
                      {/* 取消收藏按钮 */}
                      <button
                        onClick={() => handleRemove(fav.toolId)}
                        className="absolute top-3 right-3 p-1.5 rounded-full text-danger bg-danger/10 hover:bg-danger/20 transition-all duration-200 active:scale-75 z-10"
                        title="取消收藏"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <Link href={tool.href} className="block">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                            {tool.icon && (
                              <tool.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">{tool.name}</h3>
                            <p className="text-sm text-muted mt-1">{tool.description}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 收藏的资源 */}
          {resourceFavorites.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-success rounded-full" />
                收藏的资源
                <span className="text-sm font-normal text-muted">({resourceFavorites.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {resourceFavorites.map((fav) => {
                  const resource = getToolInfo(fav.toolId, fav.toolType);
                  if (!resource) return null;
                  return (
                    <div
                      key={fav.toolId}
                      className="bg-card rounded-xl p-5 border border-border hover:border-success/50 group relative transition-all duration-200 hover:shadow-md"
                    >
                      {/* 取消收藏按钮 */}
                      <button
                        onClick={() => handleRemove(fav.toolId)}
                        className="absolute top-3 right-3 p-1.5 rounded-full text-danger bg-danger/10 hover:bg-danger/20 transition-all duration-200 active:scale-75 z-10"
                        title="取消收藏"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-success" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold group-hover:text-success transition-colors">{resource.name}</h3>
                          <p className="text-sm text-muted mt-1">{resource.description}</p>
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            {resource.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-primary-light text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
