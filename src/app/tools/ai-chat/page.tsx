"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Trash2,
  Download,
  Bot,
  User,
  Sparkles,
  Loader2,
  Copy,
  Check,
  MessageSquare,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Role {
  id: string;
  name: string;
  icon: string;
  description: string;
  greeting: string;
  style: string;
}

const roles: Role[] = [
  {
    id: "general",
    name: "通用助手",
    icon: "🤖",
    description: "全能型AI助手",
    greeting: "你好！我是你的AI助手，有什么可以帮你的吗？",
    style: "友好、专业、简洁",
  },
  {
    id: "programmer",
    name: "编程专家",
    icon: "💻",
    description: "代码相关问答",
    greeting: "你好！我是编程专家，擅长各种编程语言和技术问题。",
    style: "技术性强、代码示例丰富",
  },
  {
    id: "writer",
    name: "写作助手",
    icon: "✍️",
    description: "文章创作与润色",
    greeting: "你好！我是写作助手，可以帮你创作、润色和修改文章。",
    style: "文采飞扬、注重表达",
  },
  {
    id: "translator",
    name: "翻译官",
    icon: "🌐",
    description: "多语言翻译",
    greeting: "你好！我是翻译官，支持多种语言之间的互译。",
    style: "准确、地道、保留原意",
  },
  {
    id: "psychologist",
    name: "心理咨询师",
    icon: "🧠",
    description: "情绪疏导与建议",
    greeting: "你好！我是心理咨询师，愿意倾听你的心声，给你温暖的支持。",
    style: "温暖、共情、引导式",
  },
  {
    id: "interviewer",
    name: "面试官",
    icon: "🎯",
    description: "模拟面试问答",
    greeting: "你好！我是面试官，可以帮你模拟技术面试或行为面试。",
    style: "专业、犀利、有建设性",
  },
];

const responseLibrary: Record<string, Record<string, string[]>> = {
  general: {
    你好: ["你好！很高兴见到你，有什么我可以帮助你的吗？", "你好呀！今天想聊点什么？"],
    再见: ["再见！希望很快能再帮到你。", "拜拜！有任何问题随时回来找我。"],
    谢谢: ["不客气！能帮到你我很开心。", "不用谢，这是我的职责所在。"],
    天气: [
      "我暂时无法获取实时天气信息，建议你查看天气预报应用或网站。",
      "你可以试试天气应用，或者告诉我你所在的城市，我可以给你一些穿衣建议。",
    ],
    时间: ["现在的北京时间是 " + new Date().toLocaleString("zh-CN") + "。", "你可以查看你的设备时间获取最准确的信息。"],
    名字: ["我是万能工具箱的AI助手，你可以叫我小智。", "我是你的AI助手，没有固定的名字，你可以随意称呼我。"],
    帮助: [
      "我可以帮你回答问题、写代码、翻译、写作、心理疏导等。请从左侧选择一个角色开始对话吧！",
      "我的功能包括：通用问答、编程辅助、文章写作、多语言翻译、心理咨询、面试模拟。",
    ],
  },
  programmer: {
    你好: ["你好，开发者！今天有什么技术问题想讨论？", "嗨！准备写点代码吗？"],
    代码: [
      "```javascript\n// 示例：数组去重\nconst unique = [...new Set(arr)];\n```\n\n这是JavaScript中最简洁的数组去重方法。",
      "```python\n# 示例：列表推导式\nsquares = [x**2 for x in range(10)]\n```\n\nPython的列表推导式非常强大且简洁。",
    ],
    优化: [
      "代码优化的几个方向：\n1. **算法优化** - 选择更合适的数据结构和算法\n2. **减少重复计算** - 使用缓存或记忆化\n3. **异步处理** - 避免阻塞主线程\n4. **懒加载** - 按需加载资源\n\n你可以贴出具体代码，我帮你分析。",
      "性能优化建议：\n- 避免在循环中创建对象\n- 使用合适的数据结构（Map vs Object）\n- 减少DOM操作次数\n- 使用Web Worker处理复杂计算",
    ],
    报错: [
      "遇到报错时，建议：\n1. 仔细阅读错误信息和堆栈跟踪\n2. 检查最近的代码变更\n3. 在搜索引擎中搜索错误信息\n4. 使用调试工具逐步排查\n\n你可以把报错信息贴出来，我帮你分析。",
      "调试技巧：\n- 使用console.log或断点调试\n- 检查变量类型和值\n- 确认API调用参数正确\n- 查看网络请求状态",
    ],
    学习: [
      "学习编程的建议路径：\n1. **基础** - 变量、数据类型、控制流\n2. **进阶** - 函数、面向对象、异步编程\n3. **实践** - 做小项目巩固知识\n4. **深入** - 源码阅读、设计模式\n\n推荐资源：MDN、GitHub、LeetCode",
      "编程学习资源推荐：\n- 前端：MDN Web Docs、React官方文档\n- 后端：Node.js文档、Spring Boot指南\n- 算法：LeetCode、剑指Offer\n- 实战：GitHub开源项目",
    ],
  },
  writer: {
    你好: ["你好！今天想写什么类型的文章？", "嗨！有写作灵感了吗？"],
    文章: [
      "写作建议：\n1. **明确主题** - 确定文章核心观点\n2. **列大纲** - 规划文章结构\n3. **开头吸引** - 用故事或问题引入\n4. **内容充实** - 用数据和案例支撑\n5. **结尾有力** - 总结升华或行动号召\n\n告诉我你想写什么主题？",
      "不同类型文章的结构：\n- **议论文**：论点→论据→论证→结论\n- **说明文**：定义→分类→举例→总结\n- **记叙文**：起因→经过→高潮→结局\n- **散文**：形散神聚，注重情感表达",
    ],
    润色: [
      "文章润色技巧：\n- 替换平淡词汇，使用更生动的表达\n- 调整句子长度，增加节奏感\n- 删除冗余内容，保持简洁\n- 检查逻辑连贯性\n- 注意标点符号的使用\n\n你可以把文章贴出来，我帮你逐句修改。",
      "提升文采的方法：\n1. 多用修辞手法（比喻、拟人、排比）\n2. 引用名言警句增加深度\n3. 使用具体的细节描写\n4. 注意段落之间的过渡\n5. 反复修改，精益求精",
    ],
    标题: [
      "好标题的特点：\n- **数字法**：「5个方法让你效率翻倍」\n- **悬念法**：「这个方法让我少奋斗10年」\n- **对比法**：「穷人思维 vs 富人思维」\n- **痛点法**：「为什么你总是存不下钱？」\n- **权威法**：「哈佛教授推荐的3本书」",
      "标题创作公式：\n1. 数字 + 关键词 + 利益点\n2. 如何 + 动词 + 目标\n3. 疑问词 + 痛点/好奇点\n4. 权威背书 + 具体建议\n5. 对比/反差 + 解决方案",
    ],
  },
  translator: {
    你好: ["你好！需要翻译什么内容？", "嗨！今天想翻译什么？"],
    翻译: [
      "翻译示例：\n\n**英文→中文**\n原文：The quick brown fox jumps over the lazy dog.\n译文：那只敏捷的棕色狐狸跳过了那只懒狗。\n\n**中文→英文**\n原文：学而不思则罔，思而不学则殆。\n译文：Learning without thought is labor lost; thought without learning is perilous.",
      "翻译技巧：\n1. 理解上下文，不要逐字翻译\n2. 注意文化差异，适当本地化\n3. 保持原文的语气和风格\n4. 专业术语要准确\n5. 长句拆分成短句更易读",
    ],
    英语: [
      "英语学习建议：\n- **词汇**：每天背20个单词，结合例句记忆\n- **听力**：听BBC、VOA或看美剧\n- **口语**：找语伴练习或影子跟读\n- **阅读**：读英文原著或新闻\n- **写作**：每天写一段英文日记",
      "常用英语表达：\n- How's it going?（最近怎么样？）\n- Long time no see.（好久不见。）\n- I'm all ears.（我洗耳恭听。）\n- That's a piece of cake.（小菜一碟。）\n- Break a leg!（祝你好运！）",
    ],
  },
  psychologist: {
    你好: ["你好！最近心情怎么样？", "嗨！今天想聊聊什么？"],
    压力: [
      "感到压力大是很正常的，这说明你在乎自己的生活。几个缓解压力的建议：\n\n1. **深呼吸** - 每天做5分钟腹式呼吸\n2. **运动** - 散步、瑜伽或任何你喜欢的运动\n3. **倾诉** - 和朋友或家人聊聊你的感受\n4. **分解任务** - 把大目标拆成小步骤\n5. **自我关怀** - 允许自己休息和放松\n\n你愿意说说是什么让你感到压力吗？",
      "压力管理技巧：\n- 正念冥想：每天10分钟，专注当下\n- 时间管理：区分紧急和重要的事\n- 边界设定：学会说「不」\n- 兴趣爱好：培养让自己开心的事\n- 专业帮助：必要时寻求心理咨询",
    ],
    焦虑: [
      "焦虑是大脑在试图保护你，只是有时候反应过度了。试试这些方法：\n\n1. **5-4-3-2-1法**：说出5个看到的、4个听到的、3个触摸到的、2个闻到的、1个尝到的\n2. **写下来**：把担心的事情写下来，比空想减少50%焦虑\n3. **运动**：30分钟有氧运动能显著降低焦虑水平\n4. **限制信息**：减少刷负面新闻的时间\n\n你的焦虑主要来自哪方面？",
      "应对焦虑的建议：\n- 接纳焦虑：不要对抗它，允许它存在\n- 挑战想法：问自己「最坏的结果是什么？我能承受吗？」\n- 规律作息：睡眠对情绪影响很大\n- 减少咖啡因：咖啡和茶可能加重焦虑\n- 寻求支持：和信任的人聊聊",
    ],
    失眠: [
      "失眠确实很难受，试试这些助眠方法：\n\n1. **固定作息**：每天同一时间上床和起床\n2. **睡前放松**：泡脚、听轻音乐、做拉伸\n3. **远离屏幕**：睡前1小时不看手机\n4. **营造环境**：保持卧室黑暗、凉爽、安静\n5. **不要硬躺**：20分钟睡不着就起来做点放松的事\n\n你失眠多久了？",
      "改善睡眠的小技巧：\n- 下午2点后不喝咖啡\n- 晚餐不要吃太饱\n- 睡前写「烦恼清单」，把心事放下\n- 尝试4-7-8呼吸法\n- 白天多晒太阳，调节生物钟",
    ],
  },
  interviewer: {
    你好: ["你好！准备面试了吗？想模拟哪种类型的面试？", "嗨！今天我们来模拟面试吧！"],
    面试: [
      "面试准备清单：\n\n**技术面试**：\n- 复习数据结构与算法\n- 准备项目经验介绍（STAR法则）\n- 刷LeetCode中等难度题目\n- 了解目标公司的技术栈\n\n**行为面试**：\n- 准备「自我介绍」1分钟和3分钟版本\n- 用STAR法则准备5-8个故事\n- 准备3-5个反问问题\n- 了解公司文化和价值观\n\n你想模拟哪种？",
      "常见面试问题：\n1. 请介绍一下你自己\n2. 你为什么离开上一家公司？\n3. 你最大的优点/缺点是什么？\n4. 描述一次你解决冲突的经历\n5. 你对未来3-5年的职业规划是什么？\n6. 你有什么问题要问我吗？",
    ],
    算法: [
      "算法面试准备建议：\n\n**必会数据结构**：\n- 数组、链表、栈、队列\n- 哈希表、集合\n- 二叉树、堆\n- 图（BFS、DFS）\n\n**必会算法**：\n- 排序（快排、归并）\n- 二分查找\n- 双指针、滑动窗口\n- 动态规划入门\n\n每天刷2-3题，坚持一个月会有明显进步。",
      "算法题解题框架：\n1. **理解题意** - 确认输入输出，问清边界条件\n2. **举例分析** - 用具体例子走一遍流程\n3. **选择算法** - 根据数据规模和时间复杂度要求\n4. **编码实现** - 先写伪代码，再转实际代码\n5. **测试验证** - 用例子验证，考虑边界情况",
    ],
    项目: [
      "介绍项目的STAR法则：\n\n**S - Situation（背景）**\n「在我们公司的一个电商项目中...」\n\n**T - Task（任务）**\n「我负责优化订单系统的性能...」\n\n**A - Action（行动）**\n「我分析了瓶颈，引入了Redis缓存，重构了数据库查询...」\n\n**R - Result（结果）**\n「最终QPS从100提升到5000，响应时间降低80%...」\n\n准备3-5个项目故事，覆盖不同能力维度。",
      "项目介绍要点：\n- 突出你的**个人贡献**，不是团队成果\n- 用**数据**说话：提升了X%，降低了Y秒\n- 体现**技术深度**：为什么选这个方案？\n- 展示**问题解决能力**：遇到什么困难？怎么解决的？\n- 表现**学习能力**：学到了什么新技术？",
    ],
  },
};

const genericResponses: Record<string, string[]> = {
  general: [
    "这是个有趣的问题。从多个角度来看，这涉及到很多因素。你可以告诉我更多背景信息吗？",
    "我理解你的问题。根据我的知识，这取决于具体情况。你能补充一些细节吗？",
    "很好的问题！这个话题比较复杂，我可以从不同角度为你分析。",
    "谢谢你的提问！这方面我有一些了解，让我为你梳理一下思路。",
  ],
  programmer: [
    "这个问题在开发中很常见。你可以贴出相关代码，我帮你具体分析。",
    "从技术角度来看，有几种可能的解决方案。你目前用的是什么技术栈？",
    "这是个典型的编程问题。建议先检查日志和错误信息，定位问题根源。",
    "代码相关的问题往往需要看具体实现。你可以分享一段示例代码吗？",
  ],
  writer: [
    "写作是个需要反复打磨的过程。你可以把初稿发给我，我帮你修改。",
    "这个主题很有深度。建议先列个大纲，明确要表达的核心观点。",
    "文采和逻辑同样重要。你可以先写一版，我们一起优化表达。",
    "好的文章需要好的结构。你想从哪个角度切入这个话题？",
  ],
  translator: [
    "翻译需要结合上下文才能准确。你可以提供完整的句子或段落吗？",
    "不同语境下翻译会有差异。你能告诉我是用于什么场景吗？",
    "这个表达有几种译法，取决于语气和目标受众。",
    "翻译不仅是语言的转换，更是文化的桥梁。你想传达什么样的感觉？",
  ],
  psychologist: [
    "谢谢你愿意分享。这种感觉很多人都经历过，你并不孤单。",
    "我能感受到你的情绪。愿意多说一些吗？我在这里倾听。",
    "你的感受是合理的。我们可以一起探讨如何应对这种情况。",
    "这需要时间和耐心。你已经迈出了很重要的一步——寻求帮助。",
  ],
  interviewer: [
    "这个问题考察的是XX能力。你可以用STAR法则来组织回答。",
    "面试官问这个问题，主要是想了解你的思维方式。建议从...角度回答。",
    "很好的面试问题！回答时要突出你的独特价值和具体成果。",
    "这类问题没有标准答案，关键是展示你的思考过程和解决问题的能力。",
  ],
};

function getResponse(roleId: string, input: string): string {
  const lib = responseLibrary[roleId] || responseLibrary.general;
  const generics = genericResponses[roleId] || genericResponses.general;

  // 关键词匹配
  for (const [keyword, responses] of Object.entries(lib)) {
    if (input.includes(keyword)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // 通用回复
  return generics[Math.floor(Math.random() * generics.length)];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      let code = "";
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code += lines[i] + "\n";
        i++;
      }
      elements.push(
        <pre
          key={i}
          className="bg-[#1e293b] text-[#e2e8f0] p-3 rounded-lg overflow-x-auto text-sm font-mono my-2"
        >
          {lang && <div className="text-xs text-muted mb-1">{lang}</div>}
          <code>{code.trim()}</code>
        </pre>
      );
      i++;
      continue;
    }

    // Inline code
    if (line.includes("`")) {
      const parts = line.split(/(`[^`]+`)/g);
      elements.push(
        <p key={i} className="my-1">
          {parts.map((part, idx) =>
            part.startsWith("`") && part.endsWith("`") ? (
              <code
                key={idx}
                className="bg-card-hover px-1.5 py-0.5 rounded text-sm font-mono text-primary"
              >
                {part.slice(1, -1)}
              </code>
            ) : (
              <span key={idx}>{part}</span>
            )
          )}
        </p>
      );
      i++;
      continue;
    }

    // Bold text
    if (line.includes("**")) {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      elements.push(
        <p key={i} className="my-1">
          {parts.map((part, idx) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={idx} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <span key={idx}>{part}</span>
            )
          )}
        </p>
      );
      i++;
      continue;
    }

    // Numbered list item
    if (/^\d+\.\s/.test(line)) {
      elements.push(
        <p key={i} className="my-1 pl-2">
          {line}
        </p>
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
      i++;
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={i} className="my-1">
        {line}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentRole, setCurrentRole] = useState<Role>(roles[0]);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: generateId(),
          role: "assistant",
          content: currentRole.greeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isThinking) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

    const response = getResponse(currentRole.id, userMessage.content);

    const assistantMessage: Message = {
      id: generateId(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsThinking(false);
  }, [input, isThinking, currentRole]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    if (confirm("确定要清空当前对话吗？")) {
      setMessages([
        {
          id: generateId(),
          role: "assistant",
          content: currentRole.greeting,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleExport = () => {
    const content = messages
      .map((m) => `[${formatTime(m.timestamp)}] ${m.role === "user" ? "用户" : currentRole.name}\n${m.content}\n`)
      .join("\n---\n\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AI对话_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    setMessages([
      {
        id: generateId(),
        role: "assistant",
        content: role.greeting,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-primary" />
          AI 智能对话
        </h1>
        <p className="text-muted mt-1">选择角色，开始智能对话</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Sidebar - Role Selection */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-1">选择角色</h2>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleChange(role)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                currentRole.id === role.id
                  ? "bg-primary-light border-primary text-primary"
                  : "bg-card border-border hover:bg-card-hover"
              }`}
            >
              <span className="text-xl">{role.icon}</span>
              <div>
                <div className="font-medium text-sm">{role.name}</div>
                <div className="text-xs text-muted">{role.description}</div>
              </div>
            </button>
          ))}

          <div className="mt-auto pt-4 border-t border-border">
            <div className="text-xs text-muted mb-2">当前角色风格</div>
            <div className="text-sm bg-card border border-border rounded-lg px-3 py-2">
              {currentRole.style}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col bg-card border border-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <span className="font-semibold">{currentRole.name}</span>
              <span className="text-xs text-muted bg-card-hover px-2 py-0.5 rounded-full">
                {messages.length} 条消息
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleExport}
                className="p-2 rounded-lg hover:bg-card-hover text-muted hover:text-foreground transition-colors"
                title="导出对话"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="p-2 rounded-lg hover:bg-card-hover text-muted hover:text-danger transition-colors"
                title="清空对话"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-primary-light text-primary"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className="max-w-[80%] group">
                  <div
                    className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-card-hover text-foreground rounded-bl-md border border-border"
                    }`}
                  >
                    <MarkdownContent content={message.content} />

                    {/* Copy button */}
                    <button
                      onClick={() => handleCopy(message.id, message.content)}
                      className={`absolute -top-2 ${
                        message.role === "user" ? "left-0" : "right-0"
                      } p-1 rounded-md bg-card border border-border opacity-0 group-hover:opacity-100 transition-opacity`}
                      title="复制"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3 h-3 text-success" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted" />
                      )}
                    </button>
                  </div>
                  <div
                    className={`text-[10px] text-muted mt-1 ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-card-hover border border-border rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>思考中...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-5 py-4 border-t border-border">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`给 ${currentRole.name} 发送消息...`}
                  rows={1}
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-card-hover border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary max-h-[120px]"
                  style={{ minHeight: "44px" }}
                />
                <div className="absolute right-3 bottom-3 text-[10px] text-muted">
                  Enter 发送
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className="px-4 py-3 rounded-xl bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
