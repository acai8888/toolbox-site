"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw, Wand2, Music, ExternalLink, Mic2, Guitar, Drum, Mic, Headphones, Sparkles } from "lucide-react";

interface Lyrics {
  title: string;
  style: string;
  verses: string[];
  chorus: string;
  bridge: string;
}

const musicStyles = [
  { id: "pop", name: "流行", description: "旋律优美，朗朗上口", icon: Mic2 },
  { id: "rock", name: "摇滚", description: "激情澎湃，力量感强", icon: Guitar },
  { id: "folk", name: "民谣", description: "温暖治愈，叙事感强", icon: Mic },
  { id: "rap", name: "说唱", description: "节奏感强，态度鲜明", icon: Drum },
  { id: "ancient", name: "古风", description: "意境悠远，诗词韵味", icon: Headphones },
];

const lyricsTemplates: Record<string, Lyrics[]> = {
  pop: [
    {
      title: "{topic}的夏天",
      style: "流行",
      verses: [
        "窗外的阳光洒进房间\n微风轻轻吹过你的侧脸\n那些关于{topic}的誓言\n还在耳边回响一遍又一遍",
        "走过熟悉的那条街\n回忆像电影在脑海上映\n你的笑容依然那么甜\n让我忍不住又想起昨天",
      ],
      chorus:
        "这就是{topic}的感觉\n像夏天的风温柔又热烈\n不管世界怎么变\n你在我心里永远不变\n这就是{topic}的滋味\n有欢笑也有眼泪\n愿时光能慢些\n让我们好好体会",
      bridge:
        "也许未来会有风雨\n但我会一直在这里\n陪你走过每个四季\n把{topic}写成永恒的旋律",
    },
    {
      title: "关于{topic}的事",
      style: "流行",
      verses: [
        "凌晨三点的城市还没睡\n耳机里放着熟悉的旋律\n突然想到{topic}的画面\n眼眶不知不觉有些湿润",
        "我们总在追寻着什么\n却忘了最初的快乐\n{topic}教会我的\n是珍惜当下的每一刻",
      ],
      chorus:
        "就让{topic}随风飘扬\n带到你想去的地方\n不管多远多漫长\n心中有爱就不会迷茫\n就让{topic}化作星光\n照亮你前行的方向\n就算偶尔会受伤\n也要勇敢地飞翔",
      bridge:
        "当夜幕降临的时候\n我会抬头望着星空\n想象你也在某个角落\n和我一样唱着这首歌",
    },
  ],
  rock: [
    {
      title: "{topic}狂想曲",
      style: "摇滚",
      verses: [
        "打破所有的规则\n挣脱命运的枷锁\n{topic}就是我的信仰\n没有什么能够阻挡",
        "汗水浸透了衣裳\n热血在胸中滚烫\n就算全世界都反对\n我也要放声歌唱",
      ],
      chorus:
        "来吧！一起呐喊{topic}\n让声音穿透云霄\n燃烧吧！青春不要停\n这一刻就是永恒\n来吧！一起拥抱{topic}\n让灵魂自由燃烧\n冲破吧！所有的束缚\n我们是自己的骄傲",
      bridge:
        "当吉他响起的那一刻\n整个世界都为我颤抖\n{topic}不只是两个字\n是我生命的全部意义",
    },
  ],
  folk: [
    {
      title: "{topic}的故事",
      style: "民谣",
      verses: [
        "小镇的黄昏来得特别早\n老槐树下坐着一位老人\n他抽着旱烟讲着{topic}\n眼神里满是温柔的皱纹",
        "青石板路蜿蜒向远方\n溪水潺潺流过村庄\n那些关于{topic}的旧时光\n像老照片一样泛黄",
      ],
      chorus:
        "{topic}啊{topic}\n你是岁月的歌谣\n唱给远方的人听\n也唱给故乡的桥\n{topic}啊{topic}\n你是心中的骄傲\n不管走到哪里\n都忘不掉你的好",
      bridge:
        "等到落叶铺满小径\n等到白发爬上双鬓\n我依然会轻声哼唱\n这首关于{topic}的歌",
    },
  ],
  rap: [
    {
      title: "{topic} freestyle",
      style: "说唱",
      verses: [
        "Yo 听我说 关于{topic}我有太多话\n从清晨到深夜 灵感从来不放假\n有人质疑有人嘲笑 但我从不害怕\n用实力说话 让质疑者全都哑",
        "这一路走来 有过低谷有过辉煌\n但{topic}的信念 在我心里从未忘\n不管前方多少困难 多少阻挡\我都会坚持到底 直到梦想发光",
      ],
      chorus:
        "{topic} {topic} 这是我的态度\n不随波逐流 走我自己的路\n{topic} {topic} 这是我的速度\n快到你跟不上 只能看我背影远去\n{topic} {topic} 这是我的温度\n热情似火 点燃整个舞台\n{topic} {topic} 这是我的国度\n在这里 我就是自己的主宰",
      bridge:
        "Drop the beat 让我再秀一段\n{topic}的精神 永远不会断\n从地下到地上 从无名到有名\n用汗水和泪水 写下我的传奇",
    },
  ],
  ancient: [
    {
      title: "{topic}赋",
      style: "古风",
      verses: [
        "烟雨江南 柳絮纷飞\n一曲琴音 醉了流年\n{topic}如梦 梦如烟\n谁在桥头 等谁归",
        "墨染宣纸 写下相思\n红烛摇曳 夜色迟迟\n{topic}入画 画入诗\n愿君知我 心中事",
      ],
      chorus:
        "{topic}啊{topic}\n似水流年 芳华易逝\n愿与君共 白头之约\n不负韶华 不负卿\n{topic}啊{topic}\n山高水长 天涯路远\n若有来生 再续前缘\n此生此世 永不相负",
      bridge:
        "举杯邀月 对影成三\n{topic}一曲 诉尽悲欢\n风吹过 花落满地\n独留我 在此徘徊",
    },
  ],
};

const aiMusicTools = [
  {
    name: "Suno",
    description: "目前最火的AI音乐生成工具，输入文字描述即可生成完整歌曲，支持多种风格。",
    tags: ["音乐生成", "热门", "完整歌曲"],
    url: "https://suno.com",
    icon: "🎵",
  },
  {
    name: "Udio",
    description: "高质量AI音乐生成平台，由前Google DeepMind团队打造，音乐质量极高。",
    tags: ["音乐生成", "热门", "高品质"],
    url: "https://udio.com",
    icon: "🎶",
  },
  {
    name: "AIVA",
    description: "AI作曲助手，专注于古典音乐和影视配乐，支持多种乐器和风格定制。",
    tags: ["作曲", "古典", "影视配乐"],
    url: "https://www.aiva.ai",
    icon: "🎼",
  },
  {
    name: "Boomy",
    description: "AI音乐创作平台，适合快速生成背景音乐和电子音乐，可发布到流媒体平台。",
    tags: ["电子音乐", "BGM", "免费"],
    url: "https://boomy.com",
    icon: "🎹",
  },
  {
    name: "Soundraw",
    description: "AI生成免版税背景音乐，可自定义情绪、流派、乐器，适合视频创作者。",
    tags: ["背景音乐", "免版税", "视频"],
    url: "https://soundraw.io",
    icon: "🎧",
  },
  {
    name: "Mubert",
    description: "AI生成无限流媒体音乐，适合直播、游戏、工作等场景的背景音乐。",
    tags: ["流媒体", "实时生成", "BGM"],
    url: "https://mubert.com",
    icon: "📻",
  },
  {
    name: "网易天音",
    description: "网易云音乐推出的AI音乐创作平台，支持词曲编唱一站式AI生成。",
    tags: ["国内", "一站式", "免费"],
    url: "https://tianyin.163.com",
    icon: "☁️",
  },
  {
    name: "TME Studio",
    description: "腾讯音乐推出的AI音乐创作助手，支持智能作词、作曲、编曲等功能。",
    tags: ["国内", "作词作曲", "编曲"],
    url: "https://y.qq.com/tme_studio",
    icon: "🐧",
  },
];

export default function AIMusicPage() {
  const [topic, setTopic] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(musicStyles[0]);
  const [lyrics, setLyrics] = useState<Lyrics | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLyrics = useCallback(() => {
    if (!topic.trim()) {
      alert("请输入歌词主题或情感");
      return;
    }

    setIsGenerating(true);
    setLyrics(null);

    const templates = lyricsTemplates[selectedStyle.id] || lyricsTemplates.pop;
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace placeholders
    const generated: Lyrics = {
      title: template.title.replace(/{topic}/g, topic.trim()),
      style: template.style,
      verses: template.verses.map((verse) => verse.replace(/{topic}/g, topic.trim())),
      chorus: template.chorus.replace(/{topic}/g, topic.trim()),
      bridge: template.bridge.replace(/{topic}/g, topic.trim()),
    };

    setLyrics(generated);
    setIsGenerating(false);
  }, [topic, selectedStyle]);

  const handleCopy = () => {
    if (!lyrics) return;
    const text = `《${lyrics.title}》\n风格：${lyrics.style}\n\n【主歌1】\n${lyrics.verses[0]}\n\n【主歌2】\n${lyrics.verses[1] || lyrics.verses[0]}\n\n【副歌】\n${lyrics.chorus}\n\n【桥段】\n${lyrics.bridge}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">AI音乐工具导航</h1>
        </div>
        <p className="text-muted">AI歌词生成器 + 精选AI音乐工具推荐</p>
      </div>

      {/* Lyrics Generator */}
      <div className="bg-card rounded-xl border border-border p-6 mb-10">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Mic2 className="w-5 h-5 text-primary" />
          AI歌词生成器
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                主题 / 情感 <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例如：青春、离别、追梦、爱情"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">音乐风格</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {musicStyles.map((style) => {
                  const Icon = style.icon;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`px-3 py-2.5 rounded-lg text-left transition-all duration-200 border ${
                        selectedStyle.id === style.id
                          ? "bg-primary/10 border-primary/50 text-primary"
                          : "bg-background border-border hover:border-primary/30 text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium">{style.name}</span>
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">{style.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={generateLyrics}
              disabled={isGenerating}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  创作中...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  生成歌词
                </>
              )}
            </button>

            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-xs text-accent font-medium">提示</p>
              <p className="text-xs text-muted mt-1">
                当前为前端演示模式，歌词由预设模板组合生成。每次点击会随机选择不同变体。
              </p>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-background rounded-xl border border-border p-5 min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                生成结果
              </h3>
              {lyrics && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-foreground"
                    title="复制歌词"
                  >
                    {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={generateLyrics}
                    disabled={isGenerating}
                    className="p-2 rounded-lg hover:bg-card-hover transition-colors text-muted hover:text-foreground disabled:opacity-50"
                    title="重新生成"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {!lyrics && !isGenerating && (
              <div className="flex flex-col items-center justify-center h-[250px] text-muted">
                <Music className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-sm">输入主题并点击"生成歌词"</p>
                <p className="text-xs mt-1 opacity-60">AI将为您创作原创歌词</p>
              </div>
            )}

            {lyrics && (
              <div className="space-y-4">
                <div className="text-center pb-3 border-b border-border">
                  <h4 className="font-bold text-lg">《{lyrics.title}》</h4>
                  <span className="text-xs text-muted mt-1 inline-block px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {lyrics.style}
                  </span>
                </div>

                <div className="space-y-4 text-sm leading-relaxed">
                  <div>
                    <p className="text-[10px] text-muted mb-1 font-medium uppercase tracking-wider">主歌 1</p>
                    <p className="whitespace-pre-line text-foreground">{lyrics.verses[0]}</p>
                  </div>

                  {lyrics.verses[1] && (
                    <div>
                      <p className="text-[10px] text-muted mb-1 font-medium uppercase tracking-wider">主歌 2</p>
                      <p className="whitespace-pre-line text-foreground">{lyrics.verses[1]}</p>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-[10px] text-primary mb-1 font-medium uppercase tracking-wider">副歌</p>
                    <p className="whitespace-pre-line text-foreground font-medium">{lyrics.chorus}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-muted mb-1 font-medium uppercase tracking-wider">桥段</p>
                    <p className="whitespace-pre-line text-foreground">{lyrics.bridge}</p>
                  </div>
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
          精选AI音乐工具
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aiMusicTools.map((tool) => (
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
