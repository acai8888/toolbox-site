import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们",
  description: "关于万能工具箱",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">
        关于我们 About Us
      </h1>
      <div className="space-y-6 text-muted-foreground leading-relaxed text-sm">
        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">✨ 我们是谁</h2>
          <p>
            万能工具箱是一个一站式在线工具平台，提供多种实用的在线工具、优质网站导航和免费资源下载。
          </p>
          <p>
            所有工具均在浏览器本地运行，无需注册、无需下载、无文件上传，保护您的隐私和数据安全。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">🔧 我们提供什么</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>在线工具</strong>：二维码生成、图片压缩、JSON 格式化、文本处理等实用工具</li>
            <li><strong>导航推荐</strong>：精选优质网站和工具，帮您快速找到需要的资源</li>
            <li><strong>资源下载</strong>：免费资源和资料包，助您提升效率</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">🔒 隐私保护</h2>
          <p>
            我们重视您的隐私。所有在线工具均在浏览器端运行，您的文件和数据不会上传到任何服务器。无需注册账号即可使用全部功能。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">🤝 联系我们</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>网站：https://tools.fuye.qzz.io</li>
            <li>副业导航站：https://fuye.qzz.io</li>
            <li>GitHub：https://github.com/acai8888</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">⚠️ 免责声明</h2>
          <p>
            本网站内容仅供学习参考，不构成任何收益承诺。我们不对第三方工具和资源的安全性、有效性做保证，使用前请自行评估风险。
          </p>
        </section>
      </div>
    </div>
  );
}
