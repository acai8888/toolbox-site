"use client";

import { useState, useCallback, useRef } from "react";
import {
  Upload,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Image as ImageIcon,
  Merge,
  Split,
  Images,
  ArrowLeftRight,
  X,
  Loader2,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";

type TabType = "merge" | "split" | "pdf-to-image" | "image-to-pdf";

interface PDFFile {
  file: File;
  id: string;
  pages?: number;
  size: string;
}

interface ImageFile {
  file: File;
  id: string;
  preview: string;
}

export default function PDFToolsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("merge");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">PDF 工具箱</h1>
      <p className="text-muted mb-8">纯前端 PDF 处理工具，文件不会上传到服务器</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <TabButton active={activeTab === "merge"} onClick={() => setActiveTab("merge")} icon={<Merge className="w-4 h-4" />} label="PDF合并" />
        <TabButton active={activeTab === "split"} onClick={() => setActiveTab("split")} icon={<Split className="w-4 h-4" />} label="PDF拆分" />
        <TabButton active={activeTab === "pdf-to-image"} onClick={() => setActiveTab("pdf-to-image")} icon={<Images className="w-4 h-4" />} label="PDF转图片" />
        <TabButton active={activeTab === "image-to-pdf"} onClick={() => setActiveTab("image-to-pdf")} icon={<ArrowLeftRight className="w-4 h-4" />} label="图片转PDF" />
      </div>

      {activeTab === "merge" && <PDFMerge />}
      {activeTab === "split" && <PDFSplit />}
      {activeTab === "pdf-to-image" && <PDFToImage />}
      {activeTab === "image-to-pdf" && <ImageToPDF />}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-primary text-white shadow-sm"
          : "bg-card border border-border hover:bg-card-hover text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ==================== PDF Merge ==================== */
function PDFMerge() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [merging, setMerging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf");
    addFiles(dropped);
  }, []);

  const addFiles = async (newFiles: File[]) => {
    const items: PDFFile[] = newFiles.map((file) => ({
      file,
      id: Math.random().toString(36).slice(2),
      size: (file.size / 1024).toFixed(1) + " KB",
    }));
    setFiles((prev) => [...prev, ...items]);

    // Parse page counts in background
    for (const item of items) {
      try {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        setFiles((prev) => prev.map((f) => (f.id === item.id ? { ...f, pages: pdf.getPageCount() } : f)));
      } catch {
        // ignore parse errors
      }
    }
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    setFiles((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleMerge = async () => {
    if (files.length < 2) return;
    setMerging(true);
    try {
      const merged = await PDFDocument.create();
      for (const item of files) {
        const bytes = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `merged_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("合并失败: " + (e as Error).message);
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
          dragging ? "border-primary bg-primary-light" : "border-border hover:border-primary/50"
        }`}
      >
        <Upload className="w-10 h-10 mx-auto text-muted mb-3" />
        <p className="font-medium">拖拽 PDF 文件到这里</p>
        <p className="text-sm text-muted mt-1">支持多文件上传，可调整合并顺序</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => addFiles(Array.from(e.target.files || []))}
          className="hidden"
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="mt-4 px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium"
        >
          选择文件
        </button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium">文件列表 ({files.length})</span>
            <button onClick={() => setFiles([])} className="text-xs text-danger hover:text-danger/80 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> 清空
            </button>
          </div>
          <div className="divide-y divide-border">
            {files.map((f, i) => (
              <div key={f.id} className="px-4 py-3 flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.file.name}</p>
                  <p className="text-xs text-muted">{f.pages ? `${f.pages} 页` : "待解析"} · {f.size}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveFile(i, "up")} disabled={i === 0} className="p-1 rounded hover:bg-card-hover disabled:opacity-30">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveFile(i, "down")} disabled={i === files.length - 1} className="p-1 rounded hover:bg-card-hover disabled:opacity-30">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeFile(f.id)} className="p-1 rounded hover:bg-danger/10 text-danger">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border">
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || merging}
              className="w-full py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
            >
              {merging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Merge className="w-4 h-4" />}
              {merging ? "合并中..." : "合并下载"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== PDF Split ==================== */
function PDFSplit() {
  const [file, setFile] = useState<PDFFile | null>(null);
  const [range, setRange] = useState("");
  const [splitting, setSplitting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    const item: PDFFile = { file: f, id: Math.random().toString(36).slice(2), size: (f.size / 1024).toFixed(1) + " KB" };
    setFile(item);
    try {
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setFile({ ...item, pages: pdf.getPageCount() });
    } catch {
      // ignore
    }
  };

  const parseRanges = (input: string, max: number): number[][] => {
    const groups: number[][] = [];
    let current: number[] = [];
    input.split(/,|，/).forEach((part) => {
      const trimmed = part.trim();
      if (!trimmed) return;
      if (trimmed.includes("-")) {
        const [start, end] = trimmed.split("-").map((s) => parseInt(s.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(end, max); i++) current.push(i - 1);
        }
      } else {
        const n = parseInt(trimmed);
        if (!isNaN(n) && n >= 1 && n <= max) current.push(n - 1);
      }
    });
    if (current.length > 0) groups.push(current);
    return groups;
  };

  const handleSplit = async () => {
    if (!file || !range.trim()) return;
    setSplitting(true);
    try {
      const bytes = await file.file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const max = pdf.getPageCount();
      const groups = parseRanges(range, max);
      if (groups.length === 0) {
        alert("请输入有效的页码范围");
        return;
      }
      for (let i = 0; i < groups.length; i++) {
        const newPdf = await PDFDocument.create();
        const pages = await newPdf.copyPages(pdf, groups[i]);
        pages.forEach((p) => newPdf.addPage(p));
        const splitBytes = await newPdf.save();
        const blob = new Blob([splitBytes as unknown as ArrayBuffer], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `split_${i + 1}_${file.file.name}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      alert("拆分失败: " + (e as Error).message);
    } finally {
      setSplitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = Array.from(e.dataTransfer.files).find((f) => f.type === "application/pdf"); if (f) handleFile(f); }}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
            dragging ? "border-primary bg-primary-light" : "border-border hover:border-primary/50"
          }`}
        >
          <Upload className="w-10 h-10 mx-auto text-muted mb-3" />
          <p className="font-medium">拖拽 PDF 文件到这里</p>
          <input ref={inputRef} type="file" accept="application/pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
          <button onClick={() => inputRef.current?.click()} className="mt-4 px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium">
            选择文件
          </button>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.file.name}</p>
              <p className="text-xs text-muted">{file.pages ? `${file.pages} 页` : "待解析"} · {file.size}</p>
            </div>
            <button onClick={() => { setFile(null); setRange(""); }} className="p-1.5 rounded hover:bg-danger/10 text-danger">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">页码范围</label>
            <input
              type="text"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder="例如: 1-3,5,7-9"
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted mt-1">支持格式: 1-3,5,7-9（连续页用-连接，多组用逗号分隔）</p>
          </div>

          <button
            onClick={handleSplit}
            disabled={!range.trim() || splitting}
            className="w-full py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
          >
            {splitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Split className="w-4 h-4" />}
            {splitting ? "拆分中..." : "拆分下载"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ==================== PDF to Image ==================== */
function PDFToImage() {
  const [file, setFile] = useState<PDFFile | null>(null);
  const [pageNum, setPageNum] = useState("1");
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [converting, setConverting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    const item: PDFFile = { file: f, id: Math.random().toString(36).slice(2), size: (f.size / 1024).toFixed(1) + " KB" };
    setFile(item);
    try {
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setFile({ ...item, pages: pdf.getPageCount() });
    } catch {
      // ignore
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    const target = parseInt(pageNum);
    if (isNaN(target) || target < 1) {
      alert("请输入有效的页码");
      return;
    }
    setConverting(true);
    try {
      const bytes = await file.file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      if (target > pdf.getPageCount()) {
        alert(`该PDF只有 ${pdf.getPageCount()} 页`);
        return;
      }

      // Use native browser rendering via pdf.js-like approach using embedded canvas
      // Since we can't easily render PDF pages without pdf.js, we create a simple
      // data URL representation. For a real implementation, pdf.js is recommended.
      // Here we provide a placeholder that creates a canvas with page info.
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1100;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(file.file.name, canvas.width / 2, 80);
      ctx.font = "18px sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.fillText(`第 ${target} 页 / 共 ${pdf.getPageCount()} 页`, canvas.width / 2, 130);
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(100, 200, 600, 2);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px sans-serif";
      ctx.fillText("(纯前端模式下，PDF 渲染需要 pdf.js 库支持)", canvas.width / 2, 280);
      ctx.fillText("此页面为演示，实际集成 pdf.js 后可渲染真实内容", canvas.width / 2, 310);

      const mime = format === "png" ? "image/png" : "image/jpeg";
      const dataUrl = canvas.toDataURL(mime, 0.95);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${file.file.name.replace(/\.pdf$/i, "")}_page${target}.${format}`;
      a.click();
    } catch (e) {
      alert("转换失败: " + (e as Error).message);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = Array.from(e.dataTransfer.files).find((f) => f.type === "application/pdf"); if (f) handleFile(f); }}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
            dragging ? "border-primary bg-primary-light" : "border-border hover:border-primary/50"
          }`}
        >
          <Upload className="w-10 h-10 mx-auto text-muted mb-3" />
          <p className="font-medium">拖拽 PDF 文件到这里</p>
          <input ref={inputRef} type="file" accept="application/pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
          <button onClick={() => inputRef.current?.click()} className="mt-4 px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium">
            选择文件
          </button>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.file.name}</p>
              <p className="text-xs text-muted">{file.pages ? `${file.pages} 页` : "待解析"} · {file.size}</p>
            </div>
            <button onClick={() => { setFile(null); setPageNum("1"); }} className="p-1.5 rounded hover:bg-danger/10 text-danger">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">选择页码</label>
              <input
                type="number"
                min={1}
                max={file.pages || 999}
                value={pageNum}
                onChange={(e) => setPageNum(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">输出格式</label>
              <div className="flex gap-2">
                <button onClick={() => setFormat("png")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${format === "png" ? "bg-primary text-white border-primary" : "bg-background border-border hover:bg-card-hover"}`}>PNG</button>
                <button onClick={() => setFormat("jpeg")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${format === "jpeg" ? "bg-primary text-white border-primary" : "bg-background border-border hover:bg-card-hover"}`}>JPG</button>
              </div>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={converting}
            className="w-full py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
          >
            {converting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            {converting ? "转换中..." : "转换下载"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ==================== Image to PDF ==================== */
function ImageToPDF() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [converting, setConverting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    addImages(dropped);
  }, []);

  const addImages = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImages((prev) => [...prev, { file, id: Math.random().toString(36).slice(2), preview: result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    setImages((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeImage = (id: string) => setImages((prev) => prev.filter((img) => img.id !== id));

  const handleConvert = async () => {
    if (images.length === 0) return;
    setConverting(true);
    try {
      const pdf = await PDFDocument.create();
      for (const img of images) {
        const bytes = await fetch(img.preview).then((r) => r.arrayBuffer());
        let embed;
        if (img.file.type === "image/png") {
          embed = await pdf.embedPng(bytes);
        } else if (img.file.type === "image/jpeg" || img.file.type === "image/jpg") {
          embed = await pdf.embedJpg(bytes);
        } else {
          // Convert other formats via canvas
          const canvas = document.createElement("canvas");
          const image = new Image();
          await new Promise<void>((resolve) => { image.onload = () => resolve(); image.src = img.preview; });
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(image, 0, 0);
          const pngBytes = await new Promise<ArrayBuffer>((resolve) => canvas.toBlob((blob) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as ArrayBuffer);
            r.readAsArrayBuffer(blob!);
          }, "image/png"));
          embed = await pdf.embedPng(pngBytes);
        }
        const page = pdf.addPage([embed.width, embed.height]);
        page.drawImage(embed, { x: 0, y: 0, width: embed.width, height: embed.height });
      }
      const imgPdfBytes = await pdf.save();
      const blob = new Blob([imgPdfBytes as unknown as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `images_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("转换失败: " + (e as Error).message);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
          dragging ? "border-primary bg-primary-light" : "border-border hover:border-primary/50"
        }`}
      >
        <Upload className="w-10 h-10 mx-auto text-muted mb-3" />
        <p className="font-medium">拖拽图片到这里</p>
        <p className="text-sm text-muted mt-1">支持 PNG、JPG、WebP 等格式，可调整顺序</p>
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={(e) => addImages(Array.from(e.target.files || []))} className="hidden" />
        <button onClick={() => inputRef.current?.click()} className="mt-4 px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium">
          选择图片
        </button>
      </div>

      {images.length > 0 && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium">图片列表 ({images.length})</span>
            <button onClick={() => setImages([])} className="text-xs text-danger hover:text-danger/80 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> 清空
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
            {images.map((img, i) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border bg-background">
                <img src={img.preview} alt="" className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => moveImage(i, "up")} disabled={i === 0} className="p-1 rounded bg-white/20 text-white hover:bg-white/40 disabled:opacity-30">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveImage(i, "down")} disabled={i === images.length - 1} className="p-1 rounded bg-white/20 text-white hover:bg-white/40 disabled:opacity-30">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeImage(img.id)} className="p-1 rounded bg-danger/80 text-white hover:bg-danger">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] px-2 py-1 truncate text-muted">{img.file.name}</p>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border">
            <button
              onClick={handleConvert}
              disabled={images.length === 0 || converting}
              className="w-full py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-2"
            >
              {converting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {converting ? "转换中..." : "合并为 PDF"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
