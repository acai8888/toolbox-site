"use client";

import { navCategories } from "@/data/tools";
import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";

export default function NavPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = navCategories
    .filter((cat) => !activeCat || cat.id === activeCat)
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          !search ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">导航推荐</h1>
        <p className="text-muted mt-2">精选优质网站，发现更多好用的工具和资源</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="搜索网站..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCat(null)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              !activeCat ? "bg-primary text-white" : "bg-card border border-border hover:bg-card-hover"
            }`}
          >
            全部
          </button>
          {navCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCat === cat.id ? "bg-primary text-white" : "bg-card border border-border hover:bg-card-hover"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {filtered.map((cat) => (
          <section key={cat.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                <cat.icon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">{cat.name}</h2>
              <span className="text-sm text-muted">{cat.items.length}个网站</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.items.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tool-card bg-card rounded-xl p-4 border border-border hover:border-primary/50 flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0 text-lg font-bold text-primary">
                    {item.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm group-hover:text-primary transition-colors">{item.name}</h3>
                      <ExternalLink className="w-3 h-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted mt-1">{item.description}</p>
                    {item.tags && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {item.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary-light text-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
