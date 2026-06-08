"use client";

import { useState, useCallback } from "react";
import {
  Code,
  Play,
  Copy,
  Check,
  Lightbulb,
  Zap,
  FileCode,
  Sparkles,
  Loader2,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

type Mode = "explain" | "optimize" | "generate";
type Language =
  | "javascript"
  | "python"
  | "java"
  | "cpp"
  | "go"
  | "rust"
  | "sql"
  | "html";

interface LanguageOption {
  id: Language;
  name: string;
  color: string;
}

const languages: LanguageOption[] = [
  { id: "javascript", name: "JavaScript", color: "#f7df1e" },
  { id: "python", name: "Python", color: "#3776ab" },
  { id: "java", name: "Java", color: "#b07219" },
  { id: "cpp", name: "C++", color: "#f34b7d" },
  { id: "go", name: "Go", color: "#00add8" },
  { id: "rust", name: "Rust", color: "#dea584" },
  { id: "sql", name: "SQL", color: "#e38c00" },
  { id: "html", name: "HTML/CSS", color: "#e34c26" },
];

const modeConfig: Record<
  Mode,
  {
    label: string;
    icon: React.ReactNode;
    description: string;
    inputLabel: string;
    inputPlaceholder: string;
    actionLabel: string;
  }
> = {
  explain: {
    label: "代码解释",
    icon: <Lightbulb className="w-4 h-4" />,
    description: "粘贴代码，AI为你逐行解释功能和逻辑",
    inputLabel: "输入代码",
    inputPlaceholder: "在此粘贴需要解释的代码...",
    actionLabel: "解释代码",
  },
  optimize: {
    label: "代码优化",
    icon: <Zap className="w-4 h-4" />,
    description: "分析代码问题，给出性能优化和重构建议",
    inputLabel: "输入代码",
    inputPlaceholder: "在此粘贴需要优化的代码...",
    actionLabel: "优化代码",
  },
  generate: {
    label: "代码生成",
    icon: <FileCode className="w-4 h-4" />,
    description: "选择编程语言，描述需求，生成代码模板",
    inputLabel: "描述需求",
    inputPlaceholder: "描述你需要的功能，例如：写一个函数，接收数组并返回去重后的结果...",
    actionLabel: "生成代码",
  },
};

// Simple syntax highlighter
function SyntaxHighlighter({ code, language }: { code: string; language: string }) {
  const highlighted = highlightCode(code, language);
  return (
    <pre className="bg-[#0f172a] text-[#e2e8f0] p-4 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed">
      <code dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
}

function highlightCode(code: string, language: string): string {
  let html = escapeHtml(code);

  const patterns: Record<string, { pattern: RegExp; className: string }[]> = {
    javascript: [
      { pattern: /\/\/.*$/gm, className: "text-[#6b7280]" },
      { pattern: /\/\*[\s\S]*?\*\//g, className: "text-[#6b7280]" },
      { pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, className: "text-[#22c55e]" },
      { pattern: /\b(?:const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|new|this|typeof|instanceof)\b/g, className: "text-[#60a5fa]" },
      { pattern: /\b(?:true|false|null|undefined|NaN|Infinity)\b/g, className: "text-[#f59e0b]" },
      { pattern: /\b(?:console|Math|Date|Array|Object|String|Number|Boolean|Promise|JSON|Set|Map)\b/g, className: "text-[#a78bfa]" },
      { pattern: /\b\d+\b/g, className: "text-[#f472b6]" },
    ],
    python: [
      { pattern: /#.*$/gm, className: "text-[#6b7280]" },
      { pattern: /"""[\s\S]*?"""|'''[\s\S]*?'''/g, className: "text-[#6b7280]" },
      { pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, className: "text-[#22c55e]" },
      { pattern: /\b(?:def|class|return|if|elif|else|for|while|import|from|as|try|except|with|lambda|pass|break|continue|yield|async|await|raise|finally)\b/g, className: "text-[#60a5fa]" },
      { pattern: /\b(?:True|False|None|self|cls|print|len|range|list|dict|set|tuple|str|int|float|bool)\b/g, className: "text-[#f59e0b]" },
      { pattern: /\b\d+\b/g, className: "text-[#f472b6]" },
    ],
    java: [
      { pattern: /\/\/.*$/gm, className: "text-[#6b7280]" },
      { pattern: /\/\*[\s\S]*?\*\//g, className: "text-[#6b7280]" },
      { pattern: /"(?:[^"\\]|\\.)*"/g, className: "text-[#22c55e]" },
      { pattern: /\b(?:public|private|protected|static|final|class|interface|extends|implements|return|if|else|for|while|switch|case|break|continue|new|this|super|void|int|long|double|float|boolean|char|byte|short|import|package|try|catch|finally|throw|throws|abstract|synchronized|volatile|transient)\b/g, className: "text-[#60a5fa]" },
      { pattern: /\b(?:true|false|null)\b/g, className: "text-[#f59e0b]" },
      { pattern: /\b(?:String|System|Object|Integer|Double|Boolean|List|Map|Set|ArrayList|HashMap)\b/g, className: "text-[#a78bfa]" },
      { pattern: /\b\d+\b/g, className: "text-[#f472b6]" },
    ],
    cpp: [
      { pattern: /\/\/.*$/gm, className: "text-[#6b7280]" },
      { pattern: /\/\*[\s\S]*?\*\//g, className: "text-[#6b7280]" },
      { pattern: /"(?:[^"\\]|\\.)*"/g, className: "text-[#22c55e]" },
      { pattern: /\b(?:include|using|namespace|class|struct|public|private|protected|virtual|static|const|return|if|else|for|while|do|switch|case|break|continue|new|delete|this|void|int|long|double|float|bool|char|auto|template|typename|override|explicit|inline)\b/g, className: "text-[#60a5fa]" },
      { pattern: /\b(?:true|false|null|nullptr)\b/g, className: "text-[#f59e0b]" },
      { pattern: /\b(?:cout|cin|endl|vector|string|map|set|array|unique_ptr|shared_ptr)\b/g, className: "text-[#a78bfa]" },
      { pattern: /\b\d+\b/g, className: "text-[#f472b6]" },
    ],
    go: [
      { pattern: /\/\/.*$/gm, className: "text-[#6b7280]" },
      { pattern: /"(?:[^"\\]|\\.)*"/g, className: "text-[#22c55e]" },
      { pattern: /\b(?:package|import|func|return|if|else|for|range|switch|case|break|continue|default|type|struct|interface|map|chan|go|defer|select|var|const|make|new|len|cap|append|copy|close|panic|recover)\b/g, className: "text-[#60a5fa]" },
      { pattern: /\b(?:true|false|nil|iota)\b/g, className: "text-[#f59e0b]" },
      { pattern: /\b\d+\b/g, className: "text-[#f472b6]" },
    ],
    rust: [
      { pattern: /\/\/.*$/gm, className: "text-[#6b7280]" },
      { pattern: /\/\*[\s\S]*?\*\//g, className: "text-[#6b7280]" },
      { pattern: /"(?:[^"\\]|\\.)*"/g, className: "text-[#22c55e]" },
      { pattern: /\b(?:fn|let|mut|const|static|return|if|else|match|for|while|loop|break|continue|struct|enum|trait|impl|use|mod|pub|crate|self|super|where|async|await|move|ref|box|unsafe|type|dyn|as|in)\b/g, className: "text-[#60a5fa]" },
      { pattern: /\b(?:true|false|None|Some|Ok|Err|String|Vec|Option|Result)\b/g, className: "text-[#f59e0b]" },
      { pattern: /\b\d+\b/g, className: "text-[#f472b6]" },
    ],
    sql: [
      { pattern: /--.*$/gm, className: "text-[#6b7280]" },
      { pattern: /\/\*[\s\S]*?\*\//g, className: "text-[#6b7280]" },
      { pattern: /'(?:[^'\\]|\\.)*'/g, className: "text-[#22c55e]" },
      { pattern: /\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|AS|AND|OR|NOT|NULL|IS|IN|BETWEEN|LIKE|EXISTS|CASE|WHEN|THEN|ELSE|END|IF|COUNT|SUM|AVG|MAX|MIN|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|CHECK|DEFAULT|AUTO_INCREMENT)\b/gi, className: "text-[#60a5fa]" },
      { pattern: /\b\d+\b/g, className: "text-[#f472b6]" },
    ],
    html: [
      { pattern: /&lt;!--[\s\S]*?--&gt;/g, className: "text-[#6b7280]" },
      { pattern: /&lt;\/?[\w-]+/g, className: "text-[#f87171]" },
      { pattern: /\b(?:class|id|style|href|src|alt|title|type|name|value|placeholder|disabled|readonly|required|checked|selected|multiple|action|method|target|rel|charset|content|http-equiv)\b/g, className: "text-[#60a5fa]" },
      { pattern: /"(?:[^"\\]|\\.)*"/g, className: "text-[#22c55e]" },
      { pattern: /\b\d+\b/g, className: "text-[#f472b6]" },
    ],
  };

  const langPatterns = patterns[language] || patterns.javascript;

  // Apply highlighting by wrapping matches
  // We need to be careful not to double-highlight, so we use a placeholder approach
  const placeholders: string[] = [];
  let processed = html;

  for (const { pattern, className } of langPatterns) {
    processed = processed.replace(pattern, (match) => {
      const placeholder = `\u0000${placeholders.length}\u0000`;
      placeholders.push(`<span class="${className}">${match}</span>`);
      return placeholder;
    });
  }

  // Restore placeholders
  placeholders.forEach((replacement, idx) => {
    processed = processed.replace(`\u0000${idx}\u0000`, replacement);
  });

  return processed;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Response generators
function generateExplainResponse(code: string, language: string): string {
  const lines = code.trim().split("\n").length;
  const hasFunction = /function|def|fn|func\b/.test(code);
  const hasLoop = /for|while/.test(code);
  const hasCondition = /if|else|switch/.test(code);

  let explanation = `## 代码分析\n\n这段代码共 **${lines}** 行`;

  if (hasFunction) {
    explanation += "，包含**函数定义**";
  }
  if (hasLoop) {
    explanation += hasFunction ? "和**循环结构**" : "，包含**循环结构**";
  }
  if (hasCondition) {
    explanation += hasFunction || hasLoop ? "，以及**条件判断**" : "，包含**条件判断**";
  }
  explanation += "。\n\n";

  explanation += `### 主要功能\n\n`;

  if (language === "javascript") {
    if (code.includes("fetch") || code.includes("axios") || code.includes("XMLHttpRequest")) {
      explanation += "- 这段代码涉及**网络请求**，用于与服务器进行数据交互\n";
    }
    if (code.includes("document.") || code.includes("getElementById") || code.includes("querySelector")) {
      explanation += "- 操作**DOM元素**，用于页面交互和动态内容更新\n";
    }
    if (code.includes("addEventListener") || code.includes("onclick")) {
      explanation += "- 绑定**事件监听**，响应用户操作\n";
    }
    if (code.includes("map") || code.includes("filter") || code.includes("reduce")) {
      explanation += "- 使用**数组高阶函数**进行数据处理\n";
    }
    if (code.includes("Promise") || code.includes("async") || code.includes("await")) {
      explanation += "- 使用**异步编程**处理异步操作\n";
    }
  } else if (language === "python") {
    if (code.includes("import")) {
      explanation += "- 导入外部**模块/库**扩展功能\n";
    }
    if (code.includes("class")) {
      explanation += "- 定义**类**，使用面向对象编程\n";
    }
    if (code.includes("list comprehension") || code.includes("[x for x in")) {
      explanation += "- 使用**列表推导式**进行简洁的数据处理\n";
    }
    if (code.includes("with open")) {
      explanation += "- 进行**文件操作**，读取或写入数据\n";
    }
  } else if (language === "sql") {
    explanation += "- 执行**数据库查询/操作**\n";
    if (code.includes("JOIN")) {
      explanation += "- 使用**JOIN**进行多表关联查询\n";
    }
    if (code.includes("GROUP BY")) {
      explanation += "- 使用**GROUP BY**进行分组聚合\n";
    }
    if (code.includes("WHERE")) {
      explanation += "- 使用**WHERE**进行条件过滤\n";
    }
  }

  if (!explanation.includes("- ")) {
    explanation += "- 这是一段基础代码，实现了特定的数据处理或逻辑控制功能\n";
  }

  explanation += `\n### 建议\n\n`;
  explanation += "1. 确保输入数据的**合法性验证**，防止异常输入导致错误\n";
  explanation += "2. 考虑添加**错误处理**机制，提高代码健壮性\n";
  explanation += "3. 对于复杂逻辑，建议添加**注释**说明关键步骤\n";

  return explanation;
}

function generateOptimizeResponse(code: string, language: string): string {
  let suggestions = `## 优化建议\n\n`;

  // Check for common issues
  const issues: string[] = [];

  if (code.includes("var ") && language === "javascript") {
    issues.push("- 使用 `var` 声明变量，建议改用 `const` 或 `let`，避免变量提升带来的问题");
  }

  if ((code.match(/for\s*\(/g) || []).length > 0 && code.includes(".length") && !code.includes("let ")) {
    issues.push("- 循环中重复访问 `.length` 属性，建议缓存到局部变量中");
  }

  if (code.includes("console.log") && !code.includes("//")) {
    issues.push("- 包含调试用的 `console.log`，生产环境建议移除或改用日志库");
  }

  if (code.includes("==") && !code.includes("===") && language === "javascript") {
    issues.push("- 使用 `==` 进行相等判断，建议改用 `===` 避免类型转换带来的意外行为");
  }

  if (code.includes("eval(")) {
    issues.push("- 使用了 `eval()`，存在安全风险，建议寻找替代方案");
  }

  if (!code.includes("try") && (code.includes("JSON.parse") || code.includes("parseInt"))) {
    issues.push("- 解析操作缺少异常处理，建议添加 try-catch 块");
  }

  if (issues.length > 0) {
    suggestions += `### 发现的问题\n\n${issues.join("\n")}\n\n`;
  } else {
    suggestions += "### 代码质量\n\n代码整体结构良好，未发现明显问题。以下是一些通用的优化建议：\n\n";
  }

  suggestions += `### 性能优化\n\n`;

  if (language === "javascript") {
    suggestions += "1. **减少DOM操作** - 批量修改样式或使用 DocumentFragment\n";
    suggestions += "2. **防抖节流** - 对频繁触发的事件（如 scroll、resize）使用防抖/节流\n";
    suggestions += "3. **懒加载** - 对非关键资源使用懒加载策略\n";
    suggestions += "4. **缓存结果** - 对重复计算使用记忆化（memoization）\n";
  } else if (language === "python") {
    suggestions += "1. **列表推导式** - 用推导式替代简单的 for 循环\n";
    suggestions += "2. **生成器** - 大数据集使用生成器节省内存\n";
    suggestions += "3. **内置函数** - 优先使用 map、filter 等内置函数\n";
    suggestions += "4. **多进程** - CPU密集型任务考虑使用 multiprocessing\n";
  } else if (language === "sql") {
    suggestions += "1. **添加索引** - 对 WHERE、JOIN、ORDER BY 的字段添加索引\n";
    suggestions += "2. **避免 SELECT *** - 只查询需要的字段\n";
    suggestions += "3. **分页查询** - 大数据量使用 LIMIT/OFFSET 分页\n";
    suggestions += "4. **EXPLAIN 分析** - 使用 EXPLAIN 分析查询执行计划\n";
  } else {
    suggestions += "1. **减少内存分配** - 复用对象，避免频繁创建和销毁\n";
    suggestions += "2. **算法优化** - 选择时间复杂度更优的算法\n";
    suggestions += "3. **并行处理** - 利用多线程/多进程提升性能\n";
    suggestions += "4. **缓存策略** - 对热点数据添加缓存层\n";
  }

  suggestions += `\n### 重构建议\n\n`;
  suggestions += "- 将长函数拆分为职责单一的短函数\n";
  suggestions += "- 使用有意义的变量和函数命名\n";
  suggestions += "- 遵循单一职责原则（SRP）\n";
  suggestions += "- 添加单元测试覆盖关键逻辑\n";

  return suggestions;
}

function generateCodeResponse(language: Language, description: string): string {
  const templates: Record<Language, string> = {
    javascript: `// ${description}
function main() {
  // TODO: 实现核心逻辑
  console.log("Hello, World!");
}

// 使用示例
main();`,
    python: `# ${description}
def main():
    # TODO: 实现核心逻辑
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
    java: `// ${description}
public class Main {
    public static void main(String[] args) {
        // TODO: 实现核心逻辑
        System.out.println("Hello, World!");
    }
}`,
    cpp: `// ${description}
#include <iostream>

int main() {
    // TODO: 实现核心逻辑
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
    go: `// ${description}
package main

import "fmt"

func main() {
    // TODO: 实现核心逻辑
    fmt.Println("Hello, World!")
}`,
    rust: `// ${description}
fn main() {
    // TODO: 实现核心逻辑
    println!("Hello, World!");
}`,
    sql: `-- ${description}
-- TODO: 根据需求修改表名和字段
SELECT *
FROM your_table
WHERE condition = true
LIMIT 100;`,
    html: `<!-- ${description} -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>示例页面</title>
    <style>
        /* TODO: 添加样式 */
        body { font-family: sans-serif; }
    </style>
</head>
<body>
    <!-- TODO: 添加页面内容 -->
    <h1>Hello, World!</h1>
    <script>
        // TODO: 添加交互逻辑
        console.log("Page loaded");
    </script>
</body>
</html>`,
  };

  // Keyword-based enhancements
  let code = templates[language];
  const desc = description.toLowerCase();

  if (language === "javascript") {
    if (desc.includes("数组") || desc.includes("array") || desc.includes("去重")) {
      code = `// ${description}
/**
 * 数组去重函数
 * @param {Array} arr - 输入数组
 * @returns {Array} 去重后的数组
 */
function uniqueArray(arr) {
  return [...new Set(arr)];
}

// 或使用 filter 方式（保留对象数组的去重逻辑）
function uniqueByKey(arr, key) {
  const seen = new Set();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

// 使用示例
const numbers = [1, 2, 2, 3, 4, 4, 5];
console.log(uniqueArray(numbers)); // [1, 2, 3, 4, 5]`;
    } else if (desc.includes("请求") || desc.includes("fetch") || desc.includes("api") || desc.includes("http")) {
      code = `// ${description}
/**
 * 封装 HTTP 请求
 * @param {string} url - 请求地址
 * @param {Object} options - 请求配置
 */
async function request(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

// 使用示例
request('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(err => console.error(err));`;
    }
  } else if (language === "python") {
    if (desc.includes("文件") || desc.includes("file") || desc.includes("读取")) {
      code = `# ${description}
import json
from pathlib import Path

def read_json_file(file_path):
    """读取 JSON 文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"文件不存在: {file_path}")
        return None
    except json.JSONDecodeError:
        print(f"JSON 解析失败: {file_path}")
        return None

def write_json_file(file_path, data):
    """写入 JSON 文件"""
    Path(file_path).parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# 使用示例
data = {"name": "示例", "value": 42}
write_json_file("output.json", data)
result = read_json_file("output.json")
print(result)`;
    } else if (desc.includes("爬虫") || desc.includes("爬取") || desc.includes("requests")) {
      code = `# ${description}
import requests
from bs4 import BeautifulSoup

def fetch_page(url, headers=None):
    """获取网页内容"""
    default_headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0'
    }
    
    try:
        response = requests.get(
            url, 
            headers={**default_headers, **(headers or {})},
            timeout=30
        )
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"请求失败: {e}")
        return None

def parse_html(html):
    """解析 HTML"""
    soup = BeautifulSoup(html, 'html.parser')
    # TODO: 根据需求提取数据
    return soup

# 使用示例
html = fetch_page("https://example.com")
if html:
    soup = parse_html(html)
    print(soup.title.text if soup.title else "No title")`;
    }
  } else if (language === "sql") {
    if (desc.includes("分页") || desc.includes("page")) {
      code = `-- ${description}
-- 分页查询示例
SELECT 
    id,
    name,
    created_at
FROM users
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;  -- 第1页，每页20条

-- 获取总记录数
SELECT COUNT(*) as total FROM users WHERE status = 'active';`;
    } else if (desc.includes("统计") || desc.includes("聚合") || desc.includes("group")) {
      code = `-- ${description}
-- 分组聚合统计
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary,
    MAX(salary) as max_salary,
    MIN(salary) as min_salary
FROM employees
WHERE hire_date >= '2024-01-01'
GROUP BY department
HAVING COUNT(*) >= 5
ORDER BY avg_salary DESC;`;
    }
  }

  return code;
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-lg font-bold mt-4 mb-2 text-foreground">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-base font-semibold mt-3 mb-1.5 text-foreground">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    if (line.includes("**")) {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      elements.push(
        <p key={i} className="my-1">
          {parts.map((part, idx) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={idx} className="font-semibold text-primary">
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

    if (line.startsWith("- ")) {
      elements.push(
        <p key={i} className="my-1 pl-2">
          {line}
        </p>
      );
      i++;
      continue;
    }

    if (line.startsWith("1. ") || /^\d+\.\s/.test(line)) {
      elements.push(
        <p key={i} className="my-1 pl-2">
          {line}
        </p>
      );
      i++;
      continue;
    }

    if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      let code = "";
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code += lines[i] + "\n";
        i++;
      }
      elements.push(
        <div key={i} className="my-2">
          <SyntaxHighlighter code={code.trim()} language={lang || "javascript"} />
        </div>
      );
      i++;
      continue;
    }

    elements.push(
      <p key={i} className="my-1">
        {line}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

export default function AiCodePage() {
  const [mode, setMode] = useState<Mode>("explain");
  const [language, setLanguage] = useState<Language>("javascript");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const currentLang = languages.find((l) => l.id === language) || languages[0];
  const config = modeConfig[mode];

  const handleProcess = useCallback(async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setOutput("");

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500));

    let result = "";

    switch (mode) {
      case "explain":
        result = generateExplainResponse(input, language);
        break;
      case "optimize":
        result = generateOptimizeResponse(input, language);
        break;
      case "generate":
        result = `## 生成的代码\n\n\`\`\`${language}\n${generateCodeResponse(language, input)}\n\`\`\`\n\n### 说明\n\n以上代码基于你的需求「${input}」生成。你可以根据实际场景进行调整和扩展。\n\n- 代码已包含基本的错误处理\n- 建议添加单元测试确保正确性\n- 生产环境请根据团队规范调整代码风格`;
        break;
    }

    setOutput(result);
    setIsProcessing(false);
  }, [input, mode, language, isProcessing]);

  const handleCopy = () => {
    // Extract code blocks for copying
    const codeMatch = output.match(/```[\w]*\n([\s\S]*?)\n```/);
    const textToCopy = codeMatch ? codeMatch[1] : output;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const sampleCode: Record<Language, string> = {
    javascript: `function bubbleSort(arr) {
  var n = arr.length;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))`,
    java: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`,
    cpp: `#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
    go: `package main

func bubbleSort(arr []int) []int {
    n := len(arr)
    for i := 0; i < n; i++ {
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
    return arr
}`,
    rust: `fn bubble_sort(arr: &mut [i32]) {
    let n = arr.len();
    for i in 0..n {
        for j in 0..n - i - 1 {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
}`,
    sql: `SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.name, u.email
ORDER BY order_count DESC;`,
    html: `<!DOCTYPE html>
<html>
<head>
    <title>示例</title>
    <style>
        .container { width: 100%; max-width: 1200px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello World</h1>
        <button onclick="alert('clicked')">点击</button>
    </div>
</body>
</html>`,
  };

  const loadSample = () => {
    if (mode === "generate") {
      setInput("写一个函数，接收一个数组并返回去重后的结果，要求保持原有顺序");
    } else {
      setInput(sampleCode[language]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Code className="w-7 h-7 text-primary" />
          AI 编程助手
        </h1>
        <p className="text-muted mt-1">代码解释、优化建议、智能生成</p>
      </div>

      {/* Mode Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(modeConfig) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setOutput("");
              if (m === "generate") {
                setInput("");
              }
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              mode === m
                ? "bg-primary-light border-primary text-primary"
                : "bg-card border-border hover:bg-card-hover text-foreground"
            }`}
          >
            {modeConfig[m].icon}
            {modeConfig[m].label}
          </button>
        ))}
      </div>

      {/* Mode Description */}
      <div className="mb-6 text-sm text-muted bg-card border border-border rounded-xl px-4 py-3">
        {config.description}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">{config.inputLabel}</label>
            <div className="flex items-center gap-2">
              {mode === "generate" && (
                <div className="relative">
                  <button
                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs hover:bg-card-hover transition-colors"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: currentLang.color }}
                    />
                    {currentLang.name}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {showLangDropdown && (
                    <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[140px]">
                      {languages.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => {
                            setLanguage(lang.id);
                            setShowLangDropdown(false);
                          }}
                          className={`flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-card-hover first:rounded-t-lg last:rounded-b-lg ${
                            language === lang.id ? "text-primary" : ""
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: lang.color }}
                          />
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={loadSample}
                className="text-xs text-primary hover:text-primary-hover"
              >
                加载示例
              </button>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={config.inputPlaceholder}
            rows={16}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          />

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleProcess}
              disabled={!input.trim() || isProcessing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {config.actionLabel}
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-2.5 rounded-lg bg-card border border-border hover:bg-card-hover transition-colors"
              title="清空"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">AI 分析结果</label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-xs text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? "已复制" : "复制代码"}
              </button>
            )}
          </div>

          <div className="min-h-[400px] rounded-xl bg-card border border-border overflow-hidden">
            {output ? (
              <div className="p-4 text-sm leading-relaxed overflow-auto max-h-[600px]">
                <MarkdownContent content={output} />
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted px-8">
                <Code className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm text-center">
                  {isProcessing
                    ? "AI 正在分析你的代码..."
                    : mode === "generate"
                    ? "描述需求后点击生成代码"
                    : "输入代码后点击分析按钮"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
