"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Copy, Check, RefreshCw, Wand2, FileText, MessageSquare, ShoppingBag, Briefcase, Mail, Video, BookOpen, Sparkles } from "lucide-react";

interface Template {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  fields: { key: string; label: string; placeholder: string; type?: string }[];
  variants: string[];
}

const templates: Template[] = [
  {
    id: "title",
    name: "文章标题生成",
    icon: FileText,
    description: "根据主题生成吸引人的文章标题",
    fields: [
      { key: "topic", label: "文章主题", placeholder: "例如：如何提高工作效率" },
      { key: "style", label: "标题风格", placeholder: "例如：干货型、悬念型、数字型" },
    ],
    variants: [
      "【干货】{topic}的7个实用技巧，第3个太绝了！",
      "为什么{topic}？看完这篇你就懂了",
      "{topic}：从入门到精通的完整指南",
      "震惊！{topic}竟然这么简单，很多人不知道",
      "{topic}｜3分钟学会，效率提升200%",
    ],
  },
  {
    id: "xiaohongshu",
    name: "小红书文案",
    icon: MessageSquare,
    description: "生成小红书风格的种草文案",
    fields: [
      { key: "product", label: "产品/主题", placeholder: "例如：一款美白精华" },
      { key: "scene", label: "使用场景", placeholder: "例如：熬夜后急救、日常护肤" },
      { key: "highlight", label: "核心卖点", placeholder: "例如：7天见效、温和不刺激" },
    ],
    variants: [
      "姐妹们！今天必须给你们安利这个{product}！\n\n{scene}真的太需要它了！\n\n✨{highlight}\n✨质地清爽不黏腻\n✨性价比超高\n\n用了之后真的离不开，赶紧冲！💕\n\n#{product} #好物分享 #种草",
      "挖到宝了！这个{product}真的绝！\n\n最近{scene}，试了这个直接被惊艳到！\n\n🌟{highlight}\n🌟包装高级感满满\n🌟学生党也能闭眼入\n\n真心推荐给你们！❤️\n\n#{product} #宝藏单品 #必买",
      "不允许还有人不知道这个{product}！\n\n{scene}的救星来了！\n\n💫{highlight}\n💫上脸超舒服\n💫效果肉眼可见\n\n我已经回购三次了，你们快去试试！🛒\n\n#{product} #无限回购 #好物推荐",
    ],
  },
  {
    id: "moments",
    name: "朋友圈文案",
    icon: Sparkles,
    description: "生成适合朋友圈的精致文案",
    fields: [
      { key: "theme", label: "分享主题", placeholder: "例如：周末出游、美食打卡、读书感悟" },
      { key: "mood", label: "心情/氛围", placeholder: "例如：惬意、治愈、充实、放松" },
    ],
    variants: [
      "{theme}的一天，{mood}满满～\n\n生活就是这样，在平凡的日子里找到属于自己的小确幸。✨\n\n#生活碎片 #今日份{mood}",
      "把{mood}装进{theme}里。\n\n慢下来，才能发现生活的美好。🌿\n\n#日常记录 #{theme}",
      "{theme}｜收集{mood}的瞬间\n\n日子很长，值得被认真记录。📸\n\n#朋友圈 #{theme}日常",
    ],
  },
  {
    id: "product",
    name: "产品描述",
    icon: ShoppingBag,
    description: "生成电商平台的产品详情描述",
    fields: [
      { key: "name", label: "产品名称", placeholder: "例如：无线降噪耳机" },
      { key: "category", label: "产品品类", placeholder: "例如：数码配件、家居用品" },
      { key: "features", label: "核心功能", placeholder: "例如：主动降噪、40小时续航" },
    ],
    variants: [
      "【{name}】重新定义{category}体验\n\n{features}，让每一次使用都成为享受。\n\n✅ 专业级品质，细节见真章\n✅ 人体工学设计，长时间使用不疲劳\n✅ 精工细作，只为更好的你\n\n现在下单，享受品质生活！",
      "{name}｜{category}界的颜值担当\n\n不止好看，更有实力：{features}。\n\n🌟 高颜值外观，出街必备\n🌟 强悍性能，轻松应对各种场景\n🌟 品质保障，售后无忧\n\n限时优惠，错过再等一年！",
      "这款{name}，{category}爱好者必入！\n\n{features}，用过就回不去的体验。\n\n🔥 热销爆款，口碑见证\n🔥 精选材质，耐用更安心\n🔥 贴心设计，处处为你着想\n\n立即抢购，开启品质之旅！",
    ],
  },
  {
    id: "work-summary",
    name: "工作总结",
    icon: Briefcase,
    description: "生成专业的工作总结报告",
    fields: [
      { key: "period", label: "总结周期", placeholder: "例如：2026年第二季度" },
      { key: "position", label: "岗位/职责", placeholder: "例如：前端开发工程师" },
      { key: "achievements", label: "主要成果", placeholder: "例如：完成3个项目，优化页面性能" },
    ],
    variants: [
      "{period}工作总结\n\n一、工作概述\n作为{position}，本阶段主要负责项目开发与维护工作。\n\n二、主要成果\n{achievements}，为团队目标达成提供了有力支撑。\n\n三、经验总结\n通过本阶段工作，进一步提升了技术能力与协作效率，为下一阶段工作奠定了良好基础。\n\n四、下阶段计划\n持续优化工作流程，提升交付质量，争取更大突破。",
      "{period}个人工作总结\n\n【岗位】{position}\n\n【核心成果】\n{achievements}。\n\n【能力提升】\n1. 技术深度：掌握了新的开发工具与框架\n2. 协作能力：与产品、设计团队配合更加默契\n3. 问题解决：独立排查并解决多个技术难题\n\n【未来展望】\n继续保持学习热情，在{position}领域持续深耕，创造更大价值。",
    ],
  },
  {
    id: "email",
    name: "邮件撰写",
    icon: Mail,
    description: "生成正式或商务邮件内容",
    fields: [
      { key: "purpose", label: "邮件目的", placeholder: "例如：申请请假、项目汇报、合作邀约" },
      { key: "recipient", label: "收件人身份", placeholder: "例如：直属领导、客户、合作伙伴" },
      { key: "details", label: "关键信息", placeholder: "例如：请假3天，项目延期一周" },
    ],
    variants: [
      "尊敬的{recipient}：\n\n您好！\n\n关于{purpose}一事，现向您汇报如下：\n\n{details}。具体情况已整理在附件中，请您查阅。\n\n如有任何问题，欢迎随时与我联系。期待您的回复！\n\n此致\n敬礼！\n\n【自动签名】",
      "{recipient}，您好！\n\n冒昧打扰，是关于{purpose}的事情。\n\n{details}。希望能得到您的支持与指导。\n\n期待与您进一步沟通，谢谢！\n\n祝好！",
    ],
  },
  {
    id: "video-script",
    name: "短视频脚本",
    icon: Video,
    description: "生成短视频口播脚本",
    fields: [
      { key: "topic", label: "视频主题", placeholder: "例如：职场避坑指南" },
      { key: "duration", label: "视频时长", placeholder: "例如：30秒、1分钟" },
      { key: "style", label: "风格定位", placeholder: "例如：干货分享、搞笑剧情、情感共鸣" },
    ],
    variants: [
      "【{topic}】{duration}精华版\n\n【开场】\n（3秒钩子）\n「你是不是也遇到过这种情况？」\n\n【正文】\n（核心内容）\n「今天分享{topic}，记住这3点：\n第一，……\n第二，……\n第三，……」\n\n【结尾】\n（引导互动）\n「觉得有用的话，点赞收藏，我们下期再见！」\n\n【画面建议】\n快节奏剪辑，配合关键词字幕弹出",
      "【{style}｜{topic}】\n\n【0-5秒】\n（抓眼球画面）\n「停！先别划走！」\n\n【5-20秒】\n（干货输出）\n「关于{topic}，90%的人都做错了……\n正确的做法应该是……」\n\n【20-30秒】\n（情感升华/总结）\n「记住，……才是王道！」\n\n【结尾】\n「关注我，了解更多{topic}干货！」",
    ],
  },
  {
    id: "thesis",
    name: "论文大纲",
    icon: BookOpen,
    description: "生成学术论文的结构大纲",
    fields: [
      { key: "title", label: "论文题目", placeholder: "例如：人工智能在医疗诊断中的应用研究" },
      { key: "field", label: "研究领域", placeholder: "例如：计算机科学、医学、经济学" },
      { key: "method", label: "研究方法", placeholder: "例如：实验研究、案例分析、文献综述" },
    ],
    variants: [
      "《{title}》\n\n摘要\n关键词\n\n一、引言\n  1.1 研究背景\n  1.2 研究意义\n  1.3 国内外研究现状\n  1.4 研究内容与方法\n\n二、相关理论与技术基础\n  2.1 {field}基础理论\n  2.2 核心技术概述\n  2.3 本章小结\n\n三、{method}设计与实施\n  3.1 研究方案设计\n  3.2 数据收集与处理\n  3.3 实验/分析过程\n  3.4 结果与讨论\n\n四、案例分析/实证研究\n  4.1 案例背景\n  4.2 应用效果分析\n  4.3 问题与优化建议\n\n五、结论与展望\n  5.1 研究结论\n  5.2 创新点总结\n  5.3 不足与展望\n\n参考文献\n致谢",
    ],
  },
];

export default function AIWritePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedResult, setDisplayedResult] = useState("");
  const [copied, setCopied] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const selectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setInputs({});
    setResult("");
    setDisplayedResult("");
    if (typingRef.current) {
      clearTimeout(typingRef.current);
      typingRef.current = null;
    }
  };

  const generateContent = useCallback(() => {
    // Check required fields
    const missing = selectedTemplate.fields.filter((f) => !inputs[f.key]?.trim());
    if (missing.length > 0) {
      alert(`请填写：${missing.map((f) => f.label).join("、")}`);
      return;
    }

    setIsGenerating(true);
    setResult("");
    setDisplayedResult("");

    // Pick a random variant
    const variant = selectedTemplate.variants[Math.floor(Math.random() * selectedTemplate.variants.length)];

    // Replace placeholders
    let generated = variant;
    Object.entries(inputs).forEach(([key, value]) => {
      generated = generated.replace(new RegExp(`{${key}}`, "g"), value.trim());
    });

    // Simulate typing effect
    let index = 0;
    const typeChar = () => {
      if (index <= generated.length) {
        setDisplayedResult(generated.slice(0, index));
        index++;
        typingRef.current = setTimeout(typeChar, 12 + Math.random() * 20);
      } else {
        setResult(generated);
        setIsGenerating(false);
      }
    };

    // Small delay before starting
    setTimeout(typeChar, 400);
  }, [inputs, selectedTemplate]);

  const handleCopy = () => {
    const textToCopy = result || displayedResult;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setResult("");
    setDisplayedResult("");
    generateContent();
  };

  useEffect(() => {
    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">AI写作助手</h1>
        </div>
        <p className="text-muted">智能写作模板，一键生成高质量内容</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Template Selection */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-xl border border-border p-4">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              选择模板
            </h2>
            <div className="space-y-1.5">
              {templates.map((template) => {
                const Icon = template.icon;
                const isActive = selectedTemplate.id === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 border border-primary/30 text-primary"
                        : "hover:bg-muted/50 border border-transparent text-foreground"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-muted"}`} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{template.name}</div>
                      <div className="text-xs text-muted truncate">{template.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Middle: Input Parameters */}
        <div className="lg:col-span-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              输入参数
            </h2>

            <div className="space-y-4">
              {selectedTemplate.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1.5">
                    {field.label}
                    <span className="text-danger ml-1">*</span>
                  </label>
                  <input
                    type={field.type || "text"}
                    value={inputs[field.key] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={generateContent}
              disabled={isGenerating}
              className="w-full mt-6 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  生成内容
                </>
              )}
            </button>

            <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-xs text-accent font-medium">提示</p>
              <p className="text-xs text-muted mt-1">
                当前为演示模式，内容由模板组合生成。每次点击"生成内容"会随机选择不同变体。
              </p>
            </div>
          </div>
        </div>

        {/* Right: Generated Result */}
        <div className="lg:col-span-5">
          <div className="bg-card rounded-xl border border-border p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                生成结果
              </h2>
              <div className="flex items-center gap-2">
                {(result || displayedResult) && (
                  <>
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted hover:text-foreground"
                      title="复制内容"
                    >
                      {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleRegenerate}
                      disabled={isGenerating}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted hover:text-foreground disabled:opacity-50"
                      title="重新生成"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 min-h-[300px] relative">
              {!result && !displayedResult && !isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
                  <Wand2 className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-sm">填写参数并点击"生成内容"</p>
                  <p className="text-xs mt-1 opacity-60">AI将为您生成{selectedTemplate.name}</p>
                </div>
              )}

              {(displayedResult || result) && (
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {displayedResult}
                  {isGenerating && (
                    <span className="inline-block w-2 h-4 bg-primary ml-0.5 animate-pulse" />
                  )}
                </div>
              )}
            </div>

            {result && (
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
                <span>已生成 {result.length} 字</span>
                <span className="text-success">生成完成</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
