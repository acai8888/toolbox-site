"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { quickTools } from "@/data/tools";
import { useUser } from "@/hooks/useUser";
import { useFavorites } from "@/hooks/useFavorites";

export default function ToolsPage() {
  const { user } = useUser();
  const { favorites, toggle } = useFavorites(user?.id);

  // 页面加载时记录访问统计
  useEffect(() => {
    fetch("/api/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolId: "tools-list", toolType: "page" }),
    }).catch(() => {});
  }, []);

  const handleFavorite = useCallback(
    async (e: React.MouseEvent, toolId: string, toolName: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        alert("请先登录");
        return;
      }

      await toggle(toolId, "tool");
    },
    [user, toggle]
  );

  const categories = [...new Set(quickTools.map((t) => t.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">在线工具</h1>
        <p className="text-muted mt-2">免费在线工具，无需安装，打开即用</p>
      </div>

      {categories.map((cat) => (
        <section key={cat} className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            {cat}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {quickTools
              .filter((t) => t.category === cat)
              .map((tool) => {
                const isFav = favorites.includes(tool.id);
                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="tool-card bg-card rounded-xl p-5 border border-border hover:border-primary/50 group relative"
                  >
                    {/* 收藏按钮 - 右上角 */}
                    <button
                      onClick={(e) => handleFavorite(e, tool.id, tool.name)}
                      className={`absolute top-3 right-3 p-1.5 rounded-full transition-all duration-200 z-10 ${
                        isFav
                          ? "text-danger bg-danger/10 hover:bg-danger/20"
                          : "text-muted hover:text-danger hover:bg-danger/10"
                      } active:scale-75`}
                      title={isFav ? "取消收藏" : "收藏"}
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isFav ? "fill-current scale-110" : ""
                        }`}
                      />
                    </button>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                        <tool.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{tool.name}</h3>
                        <p className="text-sm text-muted mt-1">{tool.description}</p>
                        <div className="flex gap-1.5 mt-2">
                          {tool.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                tag === "热门"
                                  ? "bg-accent/10 text-accent"
                                  : tag === "新"
                                  ? "bg-success/10 text-success"
                                  : "bg-primary-light text-primary"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
