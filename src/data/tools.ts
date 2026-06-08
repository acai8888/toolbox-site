import {
  QrCode, ImageDown, FileJson, Type, Palette, Clock,
  Globe, FileText, ArrowRightLeft, Link, Hash, Calculator,
  Wifi, MapPin, Shield, Code, FileCode, Mail, Download,
  Video, Music, Image, Layout, BookOpen, Wrench, Search,
  Navigation, FolderDown, Sparkles, Brain, Mic, VideoIcon
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  category: string;
  tags: string[];
}

export interface NavCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  items: NavItem[];
}

export interface NavItem {
  name: string;
  description: string;
  url: string;
  tags?: string[];
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  platforms: string[];
  version?: string;
}

// ===== Quick Tools (首页工具直达) =====
export const quickTools: Tool[] = [
  { id: "qrcode", name: "二维码生成", description: "生成和解析二维码", icon: QrCode, href: "/tools/qrcode", category: "实用工具", tags: ["热门"] },
  { id: "image-compress", name: "图片压缩", description: "压缩图片减小体积", icon: ImageDown, href: "/tools/image-compress", category: "图片工具", tags: ["热门"] },
  { id: "json-formatter", name: "JSON格式化", description: "格式化和验证JSON", icon: FileJson, href: "/tools/json-formatter", category: "开发工具", tags: ["热门"] },
  { id: "text-tools", name: "文本处理", description: "字数统计、大小写转换", icon: Type, href: "/tools/text-tools", category: "文本工具", tags: [] },
  { id: "color-picker", name: "颜色工具", description: "颜色选择和格式转换", icon: Palette, href: "/tools/color-picker", category: "设计工具", tags: [] },
  { id: "timestamp", name: "时间戳转换", description: "Unix时间戳互转", icon: Clock, href: "/tools/timestamp", category: "开发工具", tags: [] },
  { id: "url-encode", name: "URL编码", description: "URL编码和解码", icon: Link, href: "/tools/url-encode", category: "开发工具", tags: [] },
  { id: "base64", name: "Base64编解码", description: "Base64编码和解码", icon: Hash, href: "/tools/base64", category: "开发工具", tags: [] },
  { id: "password-gen", name: "密码生成器", description: "生成安全随机密码", icon: Shield, href: "/tools/password-gen", category: "安全工具", tags: [] },
  { id: "word-counter", name: "字数统计", description: "统计字符、词数、行数", icon: Calculator, href: "/tools/word-counter", category: "文本工具", tags: [] },
  { id: "markdown-preview", name: "Markdown预览", description: "实时预览Markdown", icon: FileCode, href: "/tools/markdown-preview", category: "开发工具", tags: [] },
  { id: "temp-mail", name: "临时邮箱", description: "一次性临时邮箱", icon: Mail, href: "/tools/temp-mail", category: "实用工具", tags: ["新"] },
];

// ===== Navigation Categories =====
export const navCategories: NavCategory[] = [
  {
    id: "ai-tools",
    name: "AI 工具",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    items: [
      { name: "ChatGPT", description: "OpenAI智能对话助手", url: "https://chat.openai.com", tags: ["AI对话", "写作"] },
      { name: "Claude", description: "Anthropic AI助手", url: "https://claude.ai", tags: ["AI对话", "分析"] },
      { name: "Midjourney", description: "AI图像生成工具", url: "https://midjourney.com", tags: ["AI绘图", "设计"] },
      { name: "通义千问", description: "阿里云AI助手", url: "https://tongyi.aliyun.com", tags: ["AI对话", "免费"] },
      { name: "文心一言", description: "百度AI助手", url: "https://yiyan.baidu.com", tags: ["AI对话", "免费"] },
      { name: "Stable Diffusion", description: "开源AI绘图工具", url: "https://stability.ai", tags: ["AI绘图", "开源"] },
    ],
  },
  {
    id: "design",
    name: "设计工具",
    icon: Palette,
    color: "from-pink-500 to-rose-500",
    items: [
      { name: "Canva", description: "在线设计平台", url: "https://canva.com", tags: ["设计", "免费"] },
      { name: "Figma", description: "协作设计工具", url: "https://figma.com", tags: ["UI设计", "协作"] },
      { name: "Remove.bg", description: "AI去除图片背景", url: "https://remove.bg", tags: ["抠图", "AI"] },
      { name: "TinyPNG", description: "在线图片压缩", url: "https://tinypng.com", tags: ["压缩", "图片"] },
      { name: "IconFont", description: "阿里巴巴图标库", url: "https://iconfont.cn", tags: ["图标", "免费"] },
      { name: "Unsplash", description: "免费高清图片", url: "https://unsplash.com", tags: ["图片", "免费"] },
    ],
  },
  {
    id: "dev",
    name: "开发工具",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    items: [
      { name: "GitHub", description: "代码托管平台", url: "https://github.com", tags: ["代码", "开源"] },
      { name: "CodePen", description: "在线代码编辑器", url: "https://codepen.io", tags: ["前端", "在线"] },
      { name: "StackBlitz", description: "在线IDE", url: "https://stackblitz.com", tags: ["IDE", "在线"] },
      { name: "Regex101", description: "正则表达式测试", url: "https://regex101.com", tags: ["正则", "测试"] },
      { name: "Can I Use", description: "浏览器兼容性查询", url: "https://caniuse.com", tags: ["兼容性", "查询"] },
      { name: "DevDocs", description: "API文档聚合", url: "https://devdocs.io", tags: ["文档", "API"] },
    ],
  },
  {
    id: "media",
    name: "影音娱乐",
    icon: Video,
    color: "from-orange-500 to-amber-500",
    items: [
      { name: "Bilibili", description: "国内弹幕视频平台", url: "https://bilibili.com", tags: ["视频", "弹幕"] },
      { name: "YouTube", description: "全球最大视频平台", url: "https://youtube.com", tags: ["视频", "全球"] },
      { name: "网易云音乐", description: "在线音乐平台", url: "https://music.163.com", tags: ["音乐", "国内"] },
      { name: "Spotify", description: "全球音乐平台", url: "https://spotify.com", tags: ["音乐", "全球"] },
    ],
  },
  {
    id: "learning",
    name: "学习资源",
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
    items: [
      { name: "MDN Web Docs", description: "Web开发权威文档", url: "https://developer.mozilla.org", tags: ["前端", "文档"] },
      { name: "菜鸟教程", description: "编程入门教程", url: "https://runoob.com", tags: ["教程", "入门"] },
      { name: "LeetCode", description: "算法刷题平台", url: "https://leetcode.cn", tags: ["算法", "面试"] },
      { name: "Coursera", description: "在线课程平台", url: "https://coursera.org", tags: ["课程", "免费"] },
    ],
  },
  {
    id: "utility",
    name: "实用工具",
    icon: Wrench,
    color: "from-slate-500 to-gray-500",
    items: [
      { name: "DeepL翻译", description: "高质量AI翻译", url: "https://deepl.com", tags: ["翻译", "AI"] },
      { name: "Notion", description: "全能笔记工具", url: "https://notion.so", tags: ["笔记", "协作"] },
      { name: "石墨文档", description: "在线协作文档", url: "https://shimo.im", tags: ["文档", "协作"] },
      { name: "ProcessOn", description: "在线流程图工具", url: "https://processon.com", tags: ["流程图", "免费"] },
    ],
  },
];

// ===== Resources =====
export const resources: Resource[] = [
  { id: "r1", name: "OBS Studio", description: "免费开源录屏直播软件", category: "视频工具", tags: ["录屏", "直播", "免费"], platforms: ["Windows", "macOS", "Linux"], version: "30.2" },
  { id: "r2", name: "DaVinci Resolve", description: "专业视频剪辑软件（免费版功能强大）", category: "视频工具", tags: ["剪辑", "调色", "免费"], platforms: ["Windows", "macOS", "Linux"], version: "19.0" },
  { id: "r3", name: "剪映专业版", description: "抖音官方视频剪辑工具", category: "视频工具", tags: ["剪辑", "字幕", "免费"], platforms: ["Windows", "macOS"], version: "6.0" },
  { id: "r4", name: "GIMP", description: "免费开源图片编辑器（PS替代）", category: "图片工具", tags: ["修图", "免费", "开源"], platforms: ["Windows", "macOS", "Linux"], version: "2.10" },
  { id: "r5", name: "IrfanView", description: "轻量级图片查看和批量处理", category: "图片工具", tags: ["查看", "批量", "免费"], platforms: ["Windows"], version: "4.66" },
  { id: "r6", name: "VS Code", description: "微软开源代码编辑器", category: "开发工具", tags: ["编辑器", "免费", "开源"], platforms: ["Windows", "macOS", "Linux"], version: "1.90" },
  { id: "r7", name: "7-Zip", description: "免费开源压缩解压工具", category: "系统工具", tags: ["压缩", "免费", "开源"], platforms: ["Windows", "Linux"], version: "24.03" },
  { id: "r8", name: "PotPlayer", description: "强大本地视频播放器", category: "影音工具", tags: ["播放器", "免费"], platforms: ["Windows"], version: "1.7" },
  { id: "r9", name: "STranslate", description: "多引擎翻译工具（支持截图翻译）", category: "效率工具", tags: ["翻译", "截图", "免费"], platforms: ["Windows"], version: "2.0" },
  { id: "r10", name: "uTools", description: "高效桌面效率工具箱", category: "效率工具", tags: ["效率", "插件", "免费"], platforms: ["Windows", "macOS", "Linux"], version: "5.0" },
  { id: "r11", name: "视频素材包", description: "7000+高清旅游航拍素材", category: "素材资源", tags: ["航拍", "4K", "免费"], platforms: ["全平台"] },
  { id: "r12", name: "BGM音乐合集", description: "450+推文爆款BGM音乐", category: "素材资源", tags: ["BGM", "爆款", "免费"], platforms: ["全平台"] },
];

export const resourceCategories = ["全部", "视频工具", "图片工具", "开发工具", "系统工具", "影音工具", "效率工具", "素材资源"];

// ===== Home Categories (首页四栏分类矩阵) =====
export interface HomeCategoryItem {
  name: string;
  description: string;
  href: string;
  isExternal: boolean;
  icon: string; // emoji string
}

export interface HomeCategory {
  id: string;
  name: string;
  subtitle: string;
  icon: string; // emoji string
  color: string; // Tailwind gradient class
  borderColor: string; // Tailwind border color
  hoverBg: string; // Tailwind hover bg
  items: HomeCategoryItem[];
}

export const homeCategories: HomeCategory[] = [
  {
    id: "ai-tools",
    name: "AI工具",
    subtitle: "自建+推荐",
    icon: "🤖",
    color: "from-purple-500 to-violet-600",
    borderColor: "border-purple-200 dark:border-purple-800/50",
    hoverBg: "hover:bg-purple-50 dark:hover:bg-purple-950/30",
    items: [
      { name: "AI写作", description: "智能文章生成与润色", href: "/tools/ai-write", isExternal: false, icon: "✍️" },
      { name: "AI绘画", description: "文字描述生成图片", href: "/tools/ai-draw", isExternal: false, icon: "🎨" },
      { name: "AI对话", description: "智能对话与问答助手", href: "/tools/ai-chat", isExternal: false, icon: "💬" },
      { name: "AI编程", description: "代码生成与辅助编程", href: "/tools/ai-code", isExternal: false, icon: "💻" },
      { name: "AI视频", description: "AI视频生成与编辑", href: "/tools/ai-video", isExternal: false, icon: "🎬" },
      { name: "AI音乐", description: "AI音乐创作与生成", href: "/tools/ai-music", isExternal: false, icon: "🎵" },
      { name: "ChatGPT", description: "OpenAI智能对话助手", href: "https://chat.openai.com", isExternal: true, icon: "🧠" },
      { name: "Claude", description: "Anthropic AI助手", href: "https://claude.ai", isExternal: true, icon: "🅰️" },
      { name: "Midjourney", description: "AI图像生成工具", href: "https://midjourney.com", isExternal: true, icon: "🖼️" },
      { name: "通义千问", description: "阿里云AI助手", href: "https://tongyi.aliyun.com", isExternal: true, icon: "☁️" },
      { name: "文心一言", description: "百度AI助手", href: "https://yiyan.baidu.com", isExternal: true, icon: "📝" },
      { name: "Stable Diffusion", description: "开源AI绘图工具", href: "https://stability.ai", isExternal: true, icon: "🌀" },
    ],
  },
  {
    id: "efficiency-tools",
    name: "效率工具",
    subtitle: "自建在线",
    icon: "⚡",
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-200 dark:border-blue-800/50",
    hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-950/30",
    items: [
      { name: "PDF工具", description: "PDF转换、合并、拆分", href: "/tools/pdf-tools", isExternal: false, icon: "📄" },
      { name: "图片处理", description: "压缩、裁剪、格式转换", href: "/tools/image-compress", isExternal: false, icon: "🖼️" },
      { name: "文字转语音", description: "文本转语音在线合成", href: "/tools/tts", isExternal: false, icon: "🔊" },
      { name: "二维码工具", description: "生成和解析二维码", href: "/tools/qrcode", isExternal: false, icon: "📱" },
      { name: "格式转换", description: "文件格式在线转换", href: "/tools/converter", isExternal: false, icon: "🔄" },
      { name: "文本处理", description: "字数统计、大小写转换", href: "/tools/text-tools", isExternal: false, icon: "📝" },
      { name: "网络工具", description: "URL编码、IP查询等", href: "/tools/url-encode", isExternal: false, icon: "🌐" },
      { name: "JSON格式化", description: "格式化和验证JSON数据", href: "/tools/json-formatter", isExternal: false, icon: "{ }" },
      { name: "Base64编解码", description: "Base64编码和解码", href: "/tools/base64", isExternal: false, icon: "🔐" },
      { name: "时间戳转换", description: "Unix时间戳互转", href: "/tools/timestamp", isExternal: false, icon: "⏱️" },
      { name: "密码生成器", description: "生成安全随机密码", href: "/tools/password-gen", isExternal: false, icon: "🔑" },
      { name: "颜色工具", description: "颜色选择和格式转换", href: "/tools/color-picker", isExternal: false, icon: "🎨" },
    ],
  },
  {
    id: "material-resources",
    name: "素材资源",
    subtitle: "精选合集",
    icon: "📦",
    color: "from-green-500 to-emerald-500",
    borderColor: "border-green-200 dark:border-green-800/50",
    hoverBg: "hover:bg-green-50 dark:hover:bg-green-950/30",
    items: [
      { name: "AI提示词库", description: "高质量AI提示词合集", href: "/resources?tag=提示词", isExternal: false, icon: "💡" },
      { name: "设计模板", description: "UI/平面设计模板资源", href: "/resources?tag=设计模板", isExternal: false, icon: "📐" },
      { name: "图标素材", description: "精美图标库与素材", href: "https://iconfont.cn", isExternal: true, icon: "🎯" },
      { name: "字体资源", description: "免费商用字体合集", href: "/resources?tag=字体", isExternal: false, icon: "🔤" },
      { name: "PPT模板", description: "精美演示文稿模板", href: "/resources?tag=PPT", isExternal: false, icon: "📊" },
      { name: "视频素材", description: "高清视频素材与BGM", href: "/resources?tag=视频素材", isExternal: false, icon: "🎬" },
      { name: "Unsplash", description: "免费高清图片素材", href: "https://unsplash.com", isExternal: true, icon: "📷" },
      { name: "Pexels", description: "免费图片和视频素材", href: "https://pexels.com", isExternal: true, icon: "🖼️" },
      { name: "Canva", description: "在线设计模板平台", href: "https://canva.com", isExternal: true, icon: "🎨" },
      { name: "Remove.bg", description: "AI去除图片背景", href: "https://remove.bg", isExternal: true, icon: "✂️" },
    ],
  },
  {
    id: "resource-nav",
    name: "资源导航",
    subtitle: "精选外链",
    icon: "🧭",
    color: "from-orange-500 to-amber-500",
    borderColor: "border-orange-200 dark:border-orange-800/50",
    hoverBg: "hover:bg-orange-50 dark:hover:bg-orange-950/30",
    items: [
      { name: "热门AI工具导航", description: "全球热门AI工具合集", href: "https://www.futurepedia.io", isExternal: true, icon: "🔥" },
      { name: "效率软件推荐", description: "优质效率软件精选", href: "https://www.producthunt.com", isExternal: true, icon: "🚀" },
      { name: "学习资源导航", description: "编程学习资源大全", href: "https://runoob.com", isExternal: true, icon: "📚" },
      { name: "开发者工具导航", description: "开发者必备工具集", href: "https://github.com", isExternal: true, icon: "🛠️" },
      { name: "优质软件推荐", description: "各平台优质软件推荐", href: "https://alternativeto.net", isExternal: true, icon: "⭐" },
      { name: "MDN Web Docs", description: "Web开发权威文档", href: "https://developer.mozilla.org", isExternal: true, icon: "📖" },
      { name: "LeetCode", description: "算法刷题面试平台", href: "https://leetcode.cn", isExternal: true, icon: "🧩" },
      { name: "DeepL翻译", description: "高质量AI翻译工具", href: "https://deepl.com", isExternal: true, icon: "🌍" },
      { name: "Notion", description: "全能笔记与协作工具", href: "https://notion.so", isExternal: true, icon: "📝" },
      { name: "Figma", description: "协作UI设计工具", href: "https://figma.com", isExternal: true, icon: "🎨" },
    ],
  },
];

// ===== Announcements (公告数据) =====
export interface Announcement {
  id: number;
  date: string;
  title: string;
  content: string;
}

export const announcements: Announcement[] = [
  { id: 1, date: "2026-06-04", title: "网站全新改版上线", content: "四栏分类布局，更高效的工具发现体验" },
  { id: 2, date: "2026-06-03", title: "新增AI写作工具", content: "支持多种AI写作模板，一键生成高质量文章" },
  { id: 3, date: "2026-06-02", title: "资源库更新", content: "新增10款精选软件资源，多网盘下载" },
  { id: 4, date: "2026-06-01", title: "用户系统上线", content: "支持登录收藏、评论评分、工具投稿" },
];
