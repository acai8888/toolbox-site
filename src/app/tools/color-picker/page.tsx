"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

export default function ColorPickerPage() {
  const [hex, setHex] = useState("#3b82f6");
  const [copied, setCopied] = useState("");

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const hsl = rgbToHsl(r, g, b);
  const rgbStr = `rgb(${r}, ${g}, ${b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  const presetColors = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
    "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
    "#d946ef", "#ec4899", "#f43f5e", "#000000", "#374151", "#6b7280",
    "#9ca3af", "#d1d5db", "#e5e7eb", "#f3f4f6", "#ffffff",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">颜色工具</h1>
      <p className="text-muted mb-8">颜色选择、格式转换和调色板</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Color Picker */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl p-6 border border-border">
            <label className="block text-sm font-medium mb-3">选择颜色</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="w-16 h-16 rounded-xl cursor-pointer border-0"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => {
                  if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setHex(e.target.value);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-background border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Color Preview */}
          <div
            className="rounded-2xl h-32 border border-border"
            style={{ backgroundColor: hex }}
          />

          {/* Color Values */}
          <div className="space-y-2">
            {[
              { label: "HEX", value: hex },
              { label: "RGB", value: rgbStr },
              { label: "HSL", value: hslStr },
            ].map((c) => (
              <div key={c.label} className="flex items-center justify-between bg-card rounded-xl px-4 py-3 border border-border">
                <div>
                  <span className="text-xs text-muted">{c.label}</span>
                  <p className="font-mono text-sm">{c.value}</p>
                </div>
                <button
                  onClick={() => handleCopy(c.value, c.label)}
                  className="p-2 rounded-lg hover:bg-card-hover"
                >
                  {copied === c.label ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preset Colors */}
        <div>
          <h2 className="text-lg font-bold mb-4">预设颜色</h2>
          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => setHex(color)}
                className={`w-full aspect-square rounded-xl border-2 transition-transform hover:scale-110 ${
                  hex === color ? "border-primary scale-110" : "border-border"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* RGB Sliders */}
          <h2 className="text-lg font-bold mt-8 mb-4">RGB 调节</h2>
          <div className="space-y-3">
            {[
              { label: "R", value: r, color: "#ef4444" },
              { label: "G", value: g, color: "#22c55e" },
              { label: "B", value: b, color: "#3b82f6" },
            ].map((ch) => (
              <div key={ch.label} className="flex items-center gap-3">
                <span className="text-sm font-bold w-4" style={{ color: ch.color }}>{ch.label}</span>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={ch.value}
                  onChange={(e) => {
                    const newR = ch.label === "R" ? Number(e.target.value) : r;
                    const newG = ch.label === "G" ? Number(e.target.value) : g;
                    const newB = ch.label === "B" ? Number(e.target.value) : b;
                    setHex(
                      "#" + [newR, newG, newB].map((v) => v.toString(16).padStart(2, "0")).join("")
                    );
                  }}
                  className="flex-1"
                  style={{ accentColor: ch.color }}
                />
                <span className="text-sm font-mono w-8 text-right">{ch.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
