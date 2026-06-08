"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Edit2, Trash2, Save, X, ExternalLink, LogOut,
  Search, Download, ChevronDown, ChevronUp, Package,
  Monitor, Apple, Terminal, Globe, Link2, AlertTriangle
} from "lucide-react";

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
  createdAt: string;
  updatedAt: string;
}

const PLATFORM_OPTIONS = ["Windows", "macOS", "Linux", "全平台"];
const PLATFORM_ICONS: Record<string, string> = {
  Windows: "💻",
  macOS: "🍎",
  Linux: "🐧",
  "全平台": "🌐",
};

const NETDISK_OPTIONS = ["夸克网盘", "迅雷网盘", "UC网盘", "百度网盘", "蓝奏云", "123云盘", "其他"];

const DEFAULT_CATEGORIES = ["视频工具", "图片工具", "开发工具", "系统工具", "影音工具", "效率工具", "素材资源", "AI工具"];

const emptyResource: Resource = {
  id: "",
  name: "",
  version: "",
  releaseDate: new Date().toISOString().split("T")[0],
  description: "",
  category: "视频工具",
  tags: [],
  platforms: ["Windows"],
  icon: "📦",
  downloadLinks: [{ platform: "夸克网盘", url: "" }],
  isActive: true,
  createdAt: "",
  updatedAt: "",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("全部");
  const [editing, setEditing] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Resource>(emptyResource);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Auth check
  useEffect(() => {
    if (!sessionStorage.getItem("admin_auth")) {
      router.push("/admin");
    }
  }, [router]);

  // Fetch resources
  const fetchResources = useCallback(async () => {
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      setResources(data.resources || []);
    } catch {
      setError("加载资源失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  // Filter
  const categories = ["全部", ...DEFAULT_CATEGORIES, ...new Set(resources.map((r) => r.category).filter((c) => !DEFAULT_CATEGORIES.includes(c)))];
  const filtered = resources
    .filter((r) => !filterCat || filterCat === "全部" || r.category === filterCat)
    .filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()));

  // CRUD operations
  const handleNew = () => {
    setForm({ ...emptyResource, downloadLinks: [{ platform: "夸克网盘", url: "" }] });
    setIsNew(true);
    setEditing(null);
    setExpanded(null);
  };

  const handleEdit = (r: Resource) => {
    setForm({ ...r });
    setIsNew(false);
    setEditing(r.id);
    setExpanded(r.id);
  };

  const handleCancel = () => {
    setForm(emptyResource);
    setIsNew(false);
    setEditing(null);
    setExpanded(null);
    setError("");
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("请输入资源名称"); return; }
    if (!form.description.trim()) { setError("请输入资源介绍"); return; }
    if (form.downloadLinks.some((l) => l.url.trim())) {} else { setError("请至少填写一个下载链接"); return; }

    setSaving(true);
    setError("");
    try {
      const url = isNew ? "/api/resources" : `/api/resources/${form.id}`;
      const method = isNew ? "POST" : "PUT";
      const body = isNew ? form : form;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      await fetchResources();
      handleCancel();
    } catch {
      setError("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/resources/${id}`, { method: "DELETE" });
      await fetchResources();
      setDeleteConfirm(null);
    } catch {
      setError("删除失败");
    }
  };

  const handleToggleActive = async (r: Resource) => {
    try {
      await fetch(`/api/resources/${r.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: r.id, isActive: !r.isActive }),
      });
      await fetchResources();
    } catch {}
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  // Form helpers
  const updateForm = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));
  const togglePlatform = (p: string) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p) ? prev.platforms.filter((x) => x !== p) : [...prev.platforms, p],
    }));
  };
  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };
  const removeTag = (t: string) => setForm((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }));
  const addDownloadLink = () => setForm((prev) => ({ ...prev, downloadLinks: [...prev.downloadLinks, { platform: "夸克网盘", url: "" }] }));
  const updateDownloadLink = (index: number, key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      downloadLinks: prev.downloadLinks.map((l, i) => (i === index ? { ...l, [key]: value } : l)),
    }));
  };
  const removeDownloadLink = (index: number) => {
    setForm((prev) => ({ ...prev, downloadLinks: prev.downloadLinks.filter((_, i) => i !== index) }));
  };

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-12 text-center text-muted">加载中...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="w-8 h-8 text-primary" />
            资源管理
          </h1>
          <p className="text-muted mt-1">管理资源下载内容，共 {resources.length} 个资源</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-sm font-medium">
            <Plus className="w-4 h-4" /> 添加资源
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-card-hover text-sm font-medium">
            <LogOut className="w-4 h-4" /> 退出
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索资源..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-danger text-sm bg-danger/10 rounded-lg px-4 py-2 mb-4">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={() => setError("")} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* New Resource Form */}
      {isNew && (
        <div className="bg-card rounded-2xl border-2 border-primary/50 p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" /> 添加新资源
          </h2>
          <ResourceForm
            form={form}
            updateForm={updateForm}
            togglePlatform={togglePlatform}
            tagInput={tagInput}
            setTagInput={setTagInput}
            addTag={addTag}
            removeTag={removeTag}
            addDownloadLink={addDownloadLink}
            updateDownloadLink={updateDownloadLink}
            removeDownloadLink={removeDownloadLink}
          />
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-medium disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? "保存中..." : "保存"}
            </button>
            <button onClick={handleCancel} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-card border border-border hover:bg-card-hover font-medium">
              <X className="w-4 h-4" /> 取消
            </button>
          </div>
        </div>
      )}

      {/* Resource List */}
      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className={`bg-card rounded-xl border transition-colors ${!r.isActive ? "border-border opacity-60" : "border-border"} ${editing === r.id ? "border-primary/50" : ""}`}>
            {/* Resource Row */}
            <div className="flex items-center gap-4 p-4">
              <span className="text-2xl">{r.icon || "📦"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{r.name}</h3>
                  <span className="text-xs text-muted">v{r.version}</span>
                  {!r.isActive && <span className="text-[10px] px-1.5 py-0.5 rounded bg-danger/10 text-danger">已下架</span>}
                </div>
                <p className="text-sm text-muted truncate">{r.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-primary-light text-primary">{r.category}</span>
                  {r.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-card-hover">{t}</span>
                  ))}
                  <span className="text-xs text-muted ml-2">
                    {r.platforms.map((p) => PLATFORM_ICONS[p] || p).join(" ")}
                  </span>
                  <span className="text-xs text-muted">{r.downloadLinks.length}个下载链接</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="p-2 rounded-lg hover:bg-card-hover" title="展开">
                  {expanded === r.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button onClick={() => handleToggleActive(r)} className={`p-2 rounded-lg hover:bg-card-hover ${r.isActive ? "text-success" : "text-muted"}`} title={r.isActive ? "下架" : "上架"}>
                  <Globe className="w-4 h-4" />
                </button>
                <button onClick={() => handleEdit(r)} className="p-2 rounded-lg hover:bg-card-hover text-primary" title="编辑">
                  <Edit2 className="w-4 h-4" />
                </button>
                {deleteConfirm === r.id ? (
                  <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 text-xs font-medium">
                    确认?
                  </button>
                ) : (
                  <button onClick={() => setDeleteConfirm(r.id)} className="p-2 rounded-lg hover:bg-card-hover text-danger" title="删除">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Expanded Edit Form */}
            {expanded === r.id && editing === r.id && (
              <div className="border-t border-border p-6">
                <ResourceForm
                  form={form}
                  updateForm={updateForm}
                  togglePlatform={togglePlatform}
                  tagInput={tagInput}
                  setTagInput={setTagInput}
                  addTag={addTag}
                  removeTag={removeTag}
                  addDownloadLink={addDownloadLink}
                  updateDownloadLink={updateDownloadLink}
                  removeDownloadLink={removeDownloadLink}
                />
                <div className="flex gap-3 mt-6">
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-medium disabled:opacity-50">
                    <Save className="w-4 h-4" /> {saving ? "保存中..." : "保存修改"}
                  </button>
                  <button onClick={handleCancel} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-card border border-border hover:bg-card-hover font-medium">
                    <X className="w-4 h-4" /> 取消
                  </button>
                </div>
              </div>
            )}

            {/* Expanded View Only */}
            {expanded === r.id && editing !== r.id && (
              <div className="border-t border-border p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted">发布日期:</span> {r.releaseDate}
                  </div>
                  <div>
                    <span className="text-muted">创建时间:</span> {new Date(r.createdAt).toLocaleString("zh-CN")}
                  </div>
                  <div>
                    <span className="text-muted">平台:</span> {r.platforms.join(", ")}
                  </div>
                  <div>
                    <span className="text-muted">分类:</span> {r.category}
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-sm text-muted">下载链接:</span>
                  <div className="mt-1 space-y-1">
                    {r.downloadLinks.map((l, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-0.5 rounded bg-primary-light text-primary text-xs">{l.platform}</span>
                        <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate flex-1 flex items-center gap-1">
                          {l.url} <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                        {l.extractCode && <span className="text-xs text-muted">提取码: {l.extractCode}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{resources.length === 0 ? "暂无资源，点击\"添加资源\"开始" : "没有匹配的资源"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Resource Form Component =====
function ResourceForm({
  form, updateForm, togglePlatform, tagInput, setTagInput, addTag, removeTag, addDownloadLink, updateDownloadLink, removeDownloadLink,
}: {
  form: Omit<Resource, "id" | "createdAt" | "updatedAt">;
  updateForm: (key: string, value: unknown) => void;
  togglePlatform: (p: string) => void;
  tagInput: string;
  setTagInput: (v: string) => void;
  addTag: () => void;
  removeTag: (t: string) => void;
  addDownloadLink: () => void;
  updateDownloadLink: (index: number, key: string, value: string) => void;
  removeDownloadLink: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Basic Info */}
      <div>
        <label className="block text-sm font-medium mb-1">资源名称 *</label>
        <input value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="如: OBS Studio" className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">版本号</label>
        <input value={form.version} onChange={(e) => updateForm("version", e.target.value)} placeholder="如: 30.2" className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">发布日期</label>
        <input type="date" value={form.releaseDate} onChange={(e) => updateForm("releaseDate", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">分类</label>
        <select value={form.category} onChange={(e) => updateForm("category", e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
          {DEFAULT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">图标 (Emoji)</label>
        <input value={form.icon || ""} onChange={(e) => updateForm("icon", e.target.value)} placeholder="📦" className="w-20 px-3 py-2.5 rounded-lg bg-background border border-border text-sm text-center text-2xl focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">支持平台</label>
        <div className="flex gap-2 flex-wrap">
          {PLATFORM_OPTIONS.map((p) => (
            <button key={p} type="button" onClick={() => togglePlatform(p)} className={`px-3 py-1.5 rounded-lg text-sm ${form.platforms.includes(p) ? "bg-primary text-white" : "bg-background border border-border hover:bg-card-hover"}`}>
              {PLATFORM_ICONS[p]} {p}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">内容介绍 *</label>
        <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="详细介绍这个资源..." rows={3} className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
      </div>

      {/* Tags */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">标签</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {form.tags.map((t) => (
            <span key={t} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-light text-primary text-xs">
              {t} <button onClick={() => removeTag(t)}><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="输入标签后回车" className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <button onClick={addTag} type="button" className="px-3 py-2 rounded-lg bg-card border border-border hover:bg-card-hover text-sm">添加</button>
        </div>
      </div>

      {/* Download Links */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2">下载链接 *</label>
        {form.downloadLinks.map((link, i) => (
          <div key={i} className="flex items-center gap-2 mb-2 p-3 rounded-lg bg-background border border-border">
            <select value={link.platform} onChange={(e) => updateDownloadLink(i, "platform", e.target.value)} className="px-2 py-1.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary/50">
              {NETDISK_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <input value={link.url} onChange={(e) => updateDownloadLink(i, "url", e.target.value)} placeholder="粘贴网盘分享链接..." className="flex-1 px-3 py-1.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" />
            <input value={link.extractCode || ""} onChange={(e) => updateDownloadLink(i, "extractCode", e.target.value)} placeholder="提取码" className="w-24 px-3 py-1.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" />
            {form.downloadLinks.length > 1 && (
              <button onClick={() => removeDownloadLink(i)} className="p-1.5 rounded-lg hover:bg-card-hover text-danger">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button onClick={addDownloadLink} type="button" className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover">
          <Plus className="w-4 h-4" /> 添加下载链接
        </button>
      </div>
    </div>
  );
}
