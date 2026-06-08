"use client";

import { useState, useCallback } from "react";
import { Upload, Download, Trash2, Image as ImageIcon } from "lucide-react";

export default function ImageCompressPage() {
  const [images, setImages] = useState<{ file: File; original: string; compressed: string; ratio: number }[]>([]);
  const [quality, setQuality] = useState(70);
  const [dragging, setDragging] = useState(false);

  const processImage = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          const compressed = canvas.toDataURL("image/jpeg", quality / 100);
          const ratio = ((1 - compressed.length / (e.target?.result as string).length) * 100);
          setImages((prev) => [
            ...prev,
            { file, original: e.target?.result as string, compressed, ratio: Math.max(0, ratio) },
          ]);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [quality]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/")).forEach(processImage);
    },
    [processImage]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">图片压缩</h1>
      <p className="text-muted mb-8">上传图片，在线压缩减小体积</p>

      {/* Quality Slider */}
      <div className="mb-6 bg-card rounded-xl p-4 border border-border">
        <label className="block text-sm font-medium mb-2">压缩质量: {quality}%</label>
        <input
          type="range"
          min={10}
          max={100}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-muted mt-1">质量越低，压缩率越高，文件越小</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
          dragging ? "border-primary bg-primary-light" : "border-border hover:border-primary/50"
        }`}
      >
        <Upload className="w-12 h-12 mx-auto text-muted mb-4" />
        <p className="text-lg font-medium">拖拽图片到这里，或点击上传</p>
        <p className="text-sm text-muted mt-2">支持 JPG、PNG、WebP 格式</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => Array.from(e.target.files || []).forEach(processImage)}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="inline-block mt-4 px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover cursor-pointer text-sm font-medium"
        >
          选择文件
        </label>
      </div>

      {/* Results */}
      {images.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">压缩结果 ({images.length}张)</h2>
            <button
              onClick={() => setImages([])}
              className="text-sm text-danger hover:text-danger/80 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" /> 清空
            </button>
          </div>
          {images.map((img, i) => (
            <div key={i} className="bg-card rounded-xl p-4 border border-border flex flex-col sm:flex-row gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-background shrink-0">
                <img src={img.compressed} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{img.file.name}</p>
                <div className="flex gap-4 mt-2 text-sm text-muted">
                  <span>原始: {(img.file.size / 1024).toFixed(1)}KB</span>
                  <span>压缩后: {(img.compressed.length / 1024).toFixed(1)}KB</span>
                  <span className={img.ratio > 0 ? "text-success" : "text-danger"}>
                    {img.ratio > 0 ? "减少" : "增加"} {Math.abs(img.ratio).toFixed(1)}%
                  </span>
                </div>
              </div>
              <a
                href={img.compressed}
                download={`compressed_${img.file.name}`}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover text-sm font-medium self-center"
              >
                <Download className="w-4 h-4" /> 下载
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
