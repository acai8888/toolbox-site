"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Sparkles, Palette, Sun, Eye, Monitor, Droplets, Heart, TrendingUp, Wand2, Lightbulb, ExternalLink } from "lucide-react";

interface StyleOption {
  id: string;
  name: string;
  enName: string;
  icon: React.ElementType;
  prompt: string;
}

interface ParamOption {
  id: string;
  name: string;
  enName: string;
  prompt: string;
}

interface HotPrompt {
  id: string;
  title: string;
  prompt: string;
  tags: string[];
  likes: number;
}

const styles: StyleOption[] = [
  { id: "realistic", name: "写实风格", enName: "Realistic", icon: Monitor, prompt: "photorealistic, highly detailed, lifelike, 8k uhd, professional photography" },
  { id: "anime", name: "动漫风格", enName: "Anime", icon: Sparkles, prompt: "anime style, manga art, vibrant colors, cel shading, detailed line art, studio ghibli inspired" },
  { id: "oil", name: "油画风格", enName: "Oil Painting", icon: Palette, prompt: "oil painting, classical art, rich textures, impasto technique, masterful brushstrokes, museum quality" },
  { id: "watercolor", name: "水彩风格", enName: "Watercolor", icon: Droplets, prompt: "watercolor painting, soft washes, flowing colors, delicate transparency, artistic illustration" },
  { id: "cyberpunk", name: "赛博朋克", enName: "Cyberpunk", icon: Monitor, prompt: "cyberpunk, neon lights, futuristic city, high tech low life, holographic, dystopian atmosphere, blade runner style" },
  { id: "chinese", name: "中国风", enName: "Chinese Style", icon: Palette, prompt: "traditional chinese art, ink wash painting, shan shui style, elegant brushwork, poetic atmosphere, oriental aesthetics" },
  { id: "pixel", name: "像素艺术", enName: "Pixel Art", icon: Monitor, prompt: "pixel art, retro game style, 16-bit, crisp pixels, nostalgic, vibrant pixelated colors" },
  { id: "3d", name: "3D渲染", enName: "3D Render", icon: Monitor, prompt: "3d render, octane render, cinematic lighting, volumetric, blender art, unreal engine 5, ray tracing" },
];

const lightingOptions: ParamOption[] = [
  { id: "soft", name: "柔和光线", enName: "Soft Light", prompt: "soft diffused lighting, gentle shadows, even illumination" },
  { id: "dramatic", name: "戏剧性光线", enName: "Dramatic", prompt: "dramatic lighting, strong contrast, chiaroscuro, cinematic shadows" },
  { id: "golden", name: "黄金时刻", enName: "Golden Hour", prompt: "golden hour lighting, warm sunset glow, long shadows, magical atmosphere" },
  { id: "neon", name: "霓虹灯光", enName: "Neon", prompt: "neon lighting, colorful glow, night atmosphere, reflective surfaces" },
  { id: "studio", name: "影棚灯光", enName: "Studio", prompt: "professional studio lighting, softbox, rim light, clean white background" },
  { id: "natural", name: "自然光", enName: "Natural", prompt: "natural daylight, sunlit, outdoor lighting, fresh and bright" },
];

const angleOptions: ParamOption[] = [
  { id: "front", name: "正面视角", enName: "Front View", prompt: "front view, facing camera, symmetrical composition" },
  { id: "side", name: "侧面视角", enName: "Side View", prompt: "side profile view, elegant silhouette, lateral perspective" },
  { id: "top", name: "俯视视角", enName: "Top Down", prompt: "top down view, aerial perspective, bird's eye view, overhead shot" },
  { id: "low", name: "低角度", enName: "Low Angle", prompt: "low angle shot, looking up, heroic perspective, dramatic upward view" },
  { id: "close", name: "特写镜头", enName: "Close Up", prompt: "extreme close up, macro shot, detailed texture, intimate perspective" },
  { id: "wide", name: "广角镜头", enName: "Wide Angle", prompt: "wide angle shot, expansive view, environmental context, grand scale" },
];

const qualityOptions: ParamOption[] = [
  { id: "masterpiece", name: "大师级", enName: "Masterpiece", prompt: "masterpiece, best quality, award winning, museum quality, extremely detailed" },
  { id: "high", name: "高品质", enName: "High Quality", prompt: "high quality, detailed, sharp focus, well composed, professional" },
  { id: "8k", name: "8K超清", enName: "8K UHD", prompt: "8k uhd, ultra high resolution, crisp details, pixel perfect" },
  { id: "trending", name: "热门风格", enName: "Trending", prompt: "trending on artstation, cgsociety, deviantart, popular style" },
];

const colorOptions: ParamOption[] = [
  { id: "vibrant", name: "鲜艳色彩", enName: "Vibrant", prompt: "vibrant colors, saturated, bold color palette, eye-catching" },
  { id: "pastel", name: "柔和 pastel", enName: "Pastel", prompt: "pastel colors, soft tones, gentle palette, dreamy atmosphere" },
  { id: "monochrome", name: "黑白单色", enName: "Monochrome", prompt: "monochrome, black and white, grayscale, classic tonal range" },
  { id: "warm", name: "暖色调", enName: "Warm", prompt: "warm color palette, orange and red tones, cozy atmosphere, sunset hues" },
  { id: "cool", name: "冷色调", enName: "Cool", prompt: "cool color palette, blue and teal tones, calm atmosphere, icy feel" },
  { id: "complementary", name: "互补色", enName: "Complementary", prompt: "complementary colors, high contrast palette, dynamic color harmony" },
];

const aiDrawTools = [
  {
    name: "Midjourney",
    description: "全球最受欢迎的AI绘画工具，通过Discord使用，生成质量极高，艺术感强。",
    tags: ["AI绘画", "高质量", "热门"],
    url: "https://www.midjourney.com",
    icon: "🎨",
  },
  {
    name: "Stable Diffusion",
    description: "开源免费的AI绘画模型，可本地部署，支持大量自定义模型和LoRA。",
    tags: ["开源", "免费", "本地部署"],
    url: "https://stability.ai",
    icon: "🌀",
  },
  {
    name: "DALL·E 3",
    description: "OpenAI推出的AI图像生成工具，理解自然语言能力强，文字渲染效果好。",
    tags: ["OpenAI", "文字渲染", "热门"],
    url: "https://openai.com/dall-e-3",
    icon: "🧠",
  },
  {
    name: "Leonardo.Ai",
    description: "专注于游戏资产生成的AI绘画平台，提供多种精细模型和实时画布功能。",
    tags: ["游戏资产", "实时画布"],
    url: "https://leonardo.ai",
    icon: "🎮",
  },
  {
    name: "LiblibAI",
    description: "国内领先的AI绘画平台，基于Stable Diffusion，模型丰富，社区活跃。",
    tags: ["国内", "模型社区", "免费额度"],
    url: "https://www.liblib.art",
    icon: "🇨🇳",
  },
  {
    name: "通义万相",
    description: "阿里云推出的AI绘画工具，支持中文提示词，风格多样，国内访问速度快。",
    tags: ["阿里云", "中文提示词", "国内"],
    url: "https://tongyi.aliyun.com/wanxiang",
    icon: "☁️",
  },
  {
    name: "即梦 (Dreamina)",
    description: "字节跳动推出的AI创作平台，支持文生图、图生图，效果惊艳。",
    tags: ["字节跳动", "文生图", "热门"],
    url: "https://jimeng.jianying.com",
    icon: "✨",
  },
  {
    name: "SeaArt",
    description: "一站式AI绘画平台，支持多种模型，界面友好，适合新手入门。",
    tags: ["新手友好", "多模型"],
    url: "https://www.seaart.ai",
    icon: "🌊",
  },
];

const hotPrompts: HotPrompt[] = [
  { id: "h1", title: "赛博朋克城市夜景", prompt: "cyberpunk cityscape at night, neon lights reflecting on wet streets, flying vehicles, towering skyscrapers with holographic ads, rain, fog, blade runner style, 8k uhd, photorealistic", tags: ["赛博朋克", "城市", "夜景"], likes: 2341 },
  { id: "h2", title: "古风山水意境", prompt: "traditional chinese landscape, misty mountains, flowing waterfall, ancient pine trees, ink wash painting style, poetic atmosphere, serene and tranquil, shan shui art, elegant brushwork", tags: ["中国风", "山水", "水墨"], likes: 1892 },
  { id: "h3", title: "未来机甲战士", prompt: "futuristic mecha warrior, sleek armor design, glowing energy core, dynamic pose, sci-fi battlefield background, dramatic lighting, octane render, highly detailed, 8k", tags: ["机甲", "科幻", "3D"], likes: 1567 },
  { id: "h4", title: "梦幻森林精灵", prompt: "enchanted forest fairy, ethereal glowing wings, surrounded by fireflies and flowers, magical atmosphere, soft pastel colors, fantasy art, detailed illustration, dreamy lighting", tags: ["奇幻", "精灵", "森林"], likes: 1432 },
  { id: "h5", title: "复古蒸汽朋克", prompt: "steampunk airship, brass and copper details, steam engines, gears and clockwork, victorian era aesthetic, dramatic clouds, highly detailed, cinematic lighting, concept art", tags: ["蒸汽朋克", "飞艇", "复古"], likes: 1205 },
  { id: "h6", title: "可爱猫咪插画", prompt: "cute fluffy cat, big sparkling eyes, sitting in a cozy window sill, sunlight streaming in, warm and cozy atmosphere, kawaii style, detailed fur texture, heartwarming illustration", tags: ["可爱", "猫咪", "插画"], likes: 987 },
];

export default function AIDrawPage() {
  const [theme, setTheme] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(styles[0]);
  const [selectedLighting, setSelectedLighting] = useState<ParamOption | null>(null);
  const [selectedAngle, setSelectedAngle] = useState<ParamOption | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<ParamOption>(qualityOptions[0]);
  const [selectedColor, setSelectedColor] = useState<ParamOption | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const generatePrompt = useCallback(() => {
    if (!theme.trim()) {
      alert("请输入主题描述");
      return;
    }

    const parts: string[] = [];

    // Main subject
    parts.push(theme.trim());

    // Style
    parts.push(selectedStyle.prompt);

    // Lighting
    if (selectedLighting) {
      parts.push(selectedLighting.prompt);
    }

    // Angle
    if (selectedAngle) {
      parts.push(selectedAngle.prompt);
    }

    // Color
    if (selectedColor) {
      parts.push(selectedColor.prompt);
    }

    // Quality
    parts.push(selectedQuality.prompt);

    setGeneratedPrompt(parts.join(", "));
  }, [theme, selectedStyle, selectedLighting, selectedAngle, selectedQuality, selectedColor]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const applyHotPrompt = (prompt: HotPrompt) => {
    setGeneratedPrompt(prompt.prompt);
    // Try to match style
    const matchedStyle = styles.find((s) =>
      prompt.tags.some((tag) => s.name.includes(tag) || s.prompt.includes(tag))
    );
    if (matchedStyle) setSelectedStyle(matchedStyle);
  };

  const getTranslationPairs = (prompt: string) => {
    const pairs: { en: string; zh: string }[] = [];
    const keywords: Record<string, string> = {
      photorealistic: "照片级真实",
      "highly detailed": "高度细节",
      "8k uhd": "8K超高清",
      "professional photography": "专业摄影",
      "anime style": "动漫风格",
      "manga art": "漫画艺术",
      "vibrant colors": "鲜艳色彩",
      "oil painting": "油画",
      "watercolor painting": "水彩画",
      cyberpunk: "赛博朋克",
      "neon lights": "霓虹灯光",
      futuristic: "未来感",
      "traditional chinese art": "中国传统艺术",
      "ink wash painting": "水墨画",
      "3d render": "3D渲染",
      "octane render": "Octane渲染",
      "cinematic lighting": "电影级灯光",
      "soft diffused lighting": "柔和漫射光",
      "dramatic lighting": "戏剧性灯光",
      "golden hour": "黄金时刻",
      "front view": "正面视角",
      "side profile": "侧面轮廓",
      "top down view": "俯视视角",
      "low angle shot": "低角度镜头",
      "extreme close up": "极端特写",
      "wide angle": "广角",
      masterpiece: "杰作",
      "best quality": "最佳品质",
      "sharp focus": "清晰对焦",
      pastel: "柔和 pastel",
      monochrome: "单色",
      "warm color": "暖色调",
      "cool color": "冷色调",
      "complementary colors": "互补色",
    };

    Object.entries(keywords).forEach(([en, zh]) => {
      if (prompt.toLowerCase().includes(en.toLowerCase())) {
        pairs.push({ en, zh });
      }
    });

    return pairs.slice(0, 8);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">AI绘画提示词生成器</h1>
        </div>
        <p className="text-muted">生成高质量的英文AI绘画提示词，支持Midjourney / Stable Diffusion</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Theme Input */}
          <div className="bg-card rounded-xl border border-border p-5">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              主题描述
            </label>
            <textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="描述你想生成的画面，例如：一只橘猫坐在窗台上晒太阳，窗外是樱花盛开的街道"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm resize-none"
            />
          </div>

          {/* Style Selection */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              绘画风格
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {styles.map((style) => {
                const Icon = style.icon;
                const isActive = selectedStyle.id === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 border-primary/50 text-primary"
                        : "bg-background border-border hover:border-primary/30 text-foreground"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted"}`} />
                    <span className="text-xs font-medium">{style.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Lighting */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4 text-primary" />
                光线效果
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {lightingOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedLighting(selectedLighting?.id === opt.id ? null : opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedLighting?.id === opt.id
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                画面视角
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {angleOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedAngle(selectedAngle?.id === opt.id ? null : opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedAngle?.id === opt.id
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-primary" />
                画质等级
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {qualityOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedQuality(opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedQuality.id === opt.id
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" />
                色彩风格
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedColor(selectedColor?.id === opt.id ? null : opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedColor?.id === opt.id
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePrompt}
            className="w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Wand2 className="w-5 h-5" />
            生成提示词
          </button>
        </div>

        {/* Right: Result */}
        <div className="lg:col-span-5 space-y-6">
          {/* Generated Prompt */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                生成的提示词
              </h2>
              {generatedPrompt && (
                <button
                  onClick={() => handleCopy(generatedPrompt)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted hover:text-foreground"
                  title="复制提示词"
                >
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            {!generatedPrompt ? (
              <div className="min-h-[160px] flex flex-col items-center justify-center text-muted">
                <Palette className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">输入主题并选择参数</p>
                <p className="text-xs mt-1 opacity-60">点击"生成提示词"获取结果</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-background border border-border">
                  <p className="text-sm leading-relaxed text-foreground font-mono">{generatedPrompt}</p>
                </div>

                {/* Translation */}
                <div>
                  <h3 className="text-xs font-medium text-muted mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" />
                    关键词对照
                  </h3>
                  <div className="space-y-1.5">
                    {getTranslationPairs(generatedPrompt).map((pair, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-1.5 rounded-md bg-muted/50 text-xs"
                      >
                        <span className="font-mono text-primary">{pair.en}</span>
                        <span className="text-muted">{pair.zh}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage Tips */}
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-xs text-accent font-medium">使用建议</p>
                  <p className="text-xs text-muted mt-1">
                    可直接复制到 Midjourney、Stable Diffusion、DALL-E 等AI绘画工具中使用。建议根据生成效果微调关键词顺序。
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Hot Prompts */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              热门提示词推荐
            </h2>
            <div className="space-y-3">
              {hotPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium truncate">{prompt.title}</h3>
                      <p className="text-xs text-muted mt-1 line-clamp-2">{prompt.prompt}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {prompt.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-primary-light text-primary font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="text-[10px] text-muted flex items-center gap-0.5">
                          <Heart className="w-3 h-3" />
                          {prompt.likes}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => applyHotPrompt(prompt)}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted hover:text-primary"
                        title="使用此提示词"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(prompt.prompt)}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted hover:text-foreground"
                        title="复制"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleFavorite(prompt.id)}
                        className={`p-1.5 rounded-md hover:bg-muted transition-colors ${
                          favorites.has(prompt.id) ? "text-danger" : "text-muted hover:text-danger"
                        }`}
                        title="收藏"
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorites.has(prompt.id) ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI绘画工具推荐 */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          精选AI绘画工具
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiDrawTools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card rounded-xl border border-border hover:border-primary/50 p-5 transition-all hover:shadow-md group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{tool.icon}</span>
                <ExternalLink className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-muted line-clamp-2 mb-3">{tool.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-primary-light text-primary font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
