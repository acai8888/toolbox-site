"use client";

import { useState, useCallback, useRef } from "react";
import { Copy, Check, RefreshCw, Wand2, Video, ExternalLink, Clock, Music, FileText, Clapperboard, Sparkles } from "lucide-react";

interface VideoScript {
  title: string;
  duration: string;
  scenes: { time: string; description: string; narration: string }[];
  bgm: string;
}

const videoTypes = [
  { id: "short", name: "短视频", description: "15-60秒，节奏快", duration: "30秒" },
  { id: "long", name: "长视频", description: "3-10分钟，深度内容", duration: "5分钟" },
  { id: "ad", name: "广告", description: "15-30秒，产品推广", duration: "15秒" },
  { id: "tutorial", name: "教程", description: "步骤清晰，干货满满", duration: "3分钟" },
];

const scriptTemplates: Record<string, VideoScript[]> = {
  short: [
    {
      title: "{topic}｜30秒搞懂",
      duration: "30秒",
      scenes: [
        { time: "0-3秒", description: "悬念开场，快速抓眼球", narration: "你知道吗？关于{topic}，90%的人都理解错了！" },
        { time: "3-15秒", description: "核心干货输出，配合关键词字幕", narration: "其实{topic}只需要记住这3点：第一，找准核心；第二，快速行动；第三，持续优化。" },
        { time: "15-25秒", description: "案例/效果展示", narration: "用这个方法，我已经帮上百人解决了{topic}的难题。" },
        { time: "25-30秒", description: "引导互动+关注", narration: "觉得有用？点赞收藏，下期教你进阶技巧！" },
      ],
      bgm: "轻快电子乐 / Upbeat Pop",
    },
    {
      title: "{topic}的秘密",
      duration: "45秒",
      scenes: [
        { time: "0-5秒", description: "冲突开场，制造好奇", narration: "停！先别划走！关于{topic}，有个秘密我必须告诉你。" },
        { time: "5-20秒", description: "揭秘核心方法", narration: "大多数人做{topic}都走弯路，真正高效的做法是..." },
        { time: "20-35秒", description: "对比展示效果", narration: "看看这个对比，左边是传统做法，右边是用我的方法...差距一目了然！" },
        { time: "35-45秒", description: "CTA号召", narration: "想学的扣1，我发你完整攻略！关注我，每天一个干货！" },
      ],
      bgm: "节奏感强的Trap / 动感BGM",
    },
  ],
  long: [
    {
      title: "{topic}完全指南",
      duration: "5分钟",
      scenes: [
        { time: "0-30秒", description: "开场引入，点明痛点", narration: "大家好，今天我们来深入聊聊{topic}。相信很多朋友在这个问题上踩过坑..." },
        { time: "30秒-2分钟", description: "背景知识+问题分析", narration: "首先，我们要理解{topic}的本质。为什么会出现这些问题？主要有三个原因..." },
        { time: "2-3.5分钟", description: "核心方法论讲解", narration: "接下来是重头戏，我总结了一套{topic}的实战方法，分为五个步骤..." },
        { time: "3.5-4.5分钟", description: "真实案例演示", narration: "我们来看一个真实案例，这是之前一位粉丝的情况..." },
        { time: "4.5-5分钟", description: "总结+互动引导", narration: "好了，以上就是关于{topic}的完整分享。如果你有任何问题，欢迎在评论区留言！" },
      ],
      bgm: "轻音乐 / Lo-Fi / 舒缓钢琴",
    },
  ],
  ad: [
    {
      title: "{topic}｜改变从现在开始",
      duration: "15秒",
      scenes: [
        { time: "0-3秒", description: "痛点冲击", narration: "还在为{topic}烦恼吗？" },
        { time: "3-10秒", description: "产品/方案亮相", narration: "试试这个！{topic}从未如此简单！" },
        { time: "10-15秒", description: "行动号召", narration: "立即体验，开启全新可能！" },
      ],
      bgm: "大气史诗 / 品牌感音乐",
    },
  ],
  tutorial: [
    {
      title: "{topic}手把手教学",
      duration: "3分钟",
      scenes: [
        { time: "0-15秒", description: "成果预览+学习目标", narration: "今天教你{topic}，学完就能上手。我们先看看最终效果..." },
        { time: "15秒-1分钟", description: "准备工作/环境搭建", narration: "第一步，准备工作。你需要..." },
        { time: "1-2分钟", description: "核心步骤演示", narration: "第二步，核心操作。注意看这里，关键点在于..." },
        { time: "2-2.5分钟", description: "常见问题排查", narration: "很多同学在这里会出错，常见问题是...解决方法是..." },
        { time: "2.5-3分钟", description: "总结+拓展", narration: "恭喜你完成了{topic}的学习！进阶内容我放在评论区了，记得查看！" },
      ],
      bgm: "轻快纯音乐 / 学习专注BGM",
    },
  ],
};

const aiVideoTools = [
  {
    name: "Runway",
    description: "强大的AI视频生成和编辑平台，支持Gen-3视频生成、视频编辑、绿幕抠像等功能。",
    tags: ["视频生成", "编辑", "热门"],
    url: "https://runwayml.com",
    icon: "🎬",
  },
  {
    name: "Pika Labs",
    description: "AI视频生成工具，支持文本/图片生成视频，特效丰富，适合创意短视频制作。",
    tags: ["视频生成", "特效"],
    url: "https://pika.art",
    icon: "✨",
  },
  {
    name: "HeyGen",
    description: "AI数字人视频平台，输入文字即可生成数字人播报视频，支持多语言和口型同步。",
    tags: ["数字人", "口播", "热门"],
    url: "https://heygen.com",
    icon: "🗣️",
  },
  {
    name: "Sora",
    description: "OpenAI推出的AI视频生成模型，可生成长达60秒的高质量视频，理解物理世界。",
    tags: ["视频生成", "OpenAI", "热门"],
    url: "https://openai.com/sora",
    icon: "🌊",
  },
  {
    name: "CapCut AI",
    description: "剪映国际版，集成AI剪辑、AI配音、智能字幕、AI特效等功能，免费好用。",
    tags: ["剪辑", "AI配音", "免费"],
    url: "https://www.capcut.com",
    icon: "✂️",
  },
  {
    name: "剪映AI",
    description: "抖音官方剪辑工具，AI智能剪口播、图文成片、数字人、智能字幕等功能强大。",
    tags: ["剪辑", "国内", "免费"],
    url: "https://www.capcut.cn",
    icon: "📱",
  },
  {
    name: "Kling AI",
    description: "快手推出的AI视频生成工具，支持文生视频、图生视频，运动幅度大、画质优秀。",
    tags: ["视频生成", "国内", "热门"],
    url: "https://klingai.com",
    icon: "🎥",
  },
  {
    name: "Luma Dream Machine",
    description: "Luma AI的视频生成工具，生成速度快，视频质量高，支持相机运动控制。",
    tags: ["视频生成", "3D"],
    url: "https://lumalabs.ai/dream-machine",
    icon: "🌟",
  },
];

export default function AIVideoPage() {
  const [topic, setTopic] = useState("");
  const [selectedType, setSelectedType] = useState(videoTypes[0]);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const [displayedScript, setDisplayedScript] = useState<VideoScript | null>(null);
  const [typingIndex, setTypingIndex] = useState(0);

  const generateScript = useCallback(() => {
    if (!topic.trim()) {
      alert("请输入视频主题");
      return;
    }

    setIsGenerating(true);
    setScript(null);
    setDisplayedScript(null);

    const templates = scriptTemplates[selectedType.id] || scriptTemplates.short;
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace placeholders
    const generated: VideoScript = {
      title: template.title.replace(/{topic}/g, topic.trim()),
      duration: template.duration,
      scenes: template.scenes.map((scene) => ({
        time: scene.time,
        description: scene.description,
        narration: scene.narration.replace(/{topic}/g, topic.trim()),
      })),
      bgm: template.bgm,
    };

    setScript(generated);
    setDisplayedScript(generated);
    setIsGenerating(false);
  }, [topic, selectedType]);

  const handleCopy = () => {
    if (!script) return;
    const text = `【${script.title}】\n时长：${script.duration}\n\n分镜脚本：\n${script.scenes
      .map((s, i) => `镜头${i + 1} (${s.time})\n画面：${s.description}\n旁白：${s.narration}`)
      .join("\n\n")}\n\nBGM建议：${script.bgm}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">AI视频工具导航</h1>
        </div>
        <p className="text-muted">AI视频脚本生成器 + 精选AI视频工具推荐</p>
      </div>

      {/* Script Generator */}
      <div className="bg-card rounded-xl border border-border p-6 mb-10">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Clapperboard className="w-5 h-5 text-primary" />
          AI视频脚本生成器
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                视频主题 <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例如：如何高效学习编程"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">视频类型</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {videoTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-2.5 rounded-lg text-left transition-all duration-200 border ${
                      selectedType.id === type.id
                        ? "bg-primary/10 border-primary/50 text-primary"
                        : "bg-background border-border hover:border-primary/30 text-foreground"
                    }`}
                  >
                    <div className="text-sm font-medium">{type.name}</div>
                    <div className="text-[10px] text-muted mt-0.5">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateScript}
              disabled={isGenerating}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  生成脚本大纲
                </>
              )}
            </button>

            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-xs text-accent font-medium">提示</p>
              <p className="text-xs text-muted mt-1">
                当前为前端演示模式，脚本由预设模板组合生成。每次点击会随机选择不同变体。
              </p>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-background rounded-xl border border-border p-5 min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                生成结果
              </h3>
              {script && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-foreground"
                    title="复制脚本"
                  >
                    {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={generateScript}
                    disabled={isGenerating}
                    className="p-2 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-foreground disabled:opacity-50"
                    title="重新生成"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {!script && !isGenerating && (
              <div className="flex flex-col items-center justify-center h-[250px] text-muted">
                <Clapperboard className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-sm">输入主题并点击"生成脚本大纲"</p>
                <p className="text-xs mt-1 opacity-60">AI将为您生成视频脚本</p>
              </div>
            )}

            {script && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                    <Video className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{script.title}</h4>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {script.duration}
                      </span>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        {script.bgm}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {script.scenes.map((scene, index) => (
                    <div key={index} className="p-3 rounded-lg bg-card border border-border">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                          镜头{index + 1}
                        </span>
                        <span className="text-xs text-muted">{scene.time}</span>
                      </div>
                      <p className="text-xs text-muted mb-1">
                        <span className="font-medium text-foreground">画面：</span>
                        {scene.description}
                      </p>
                      <p className="text-xs">
                        <span className="font-medium text-foreground">旁白：</span>
                        <span className="text-primary">{scene.narration}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          精选AI视频工具
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiVideoTools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tool-card bg-card rounded-xl p-5 border border-border hover:border-primary/50 group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{tool.icon}</span>
                <ExternalLink className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">{tool.name}</h3>
              <p className="text-sm text-muted mt-1.5 line-clamp-2">{tool.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      tag === "热门"
                        ? "bg-accent/10 text-accent"
                        : tag === "免费"
                        ? "bg-success/10 text-success"
                        : "bg-primary-light text-primary"
                    }`}
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
