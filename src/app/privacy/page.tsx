import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "万能工具箱隐私政策",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">
        隐私政策 Privacy Policy
      </h1>
      <div className="space-y-6 text-muted-foreground leading-relaxed text-sm">
        <p>最后更新 / Last Updated: 2026年6月8日</p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. 信息收集</h2>
          <p>本网站（tools.fuye.qzz.io）在您访问时可能收集以下信息：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>自动收集的信息</strong>：包括 IP 地址、浏览器类型、设备信息、访问时间和页面浏览记录。这些信息由 Google Analytics 等分析工具收集，用于改善网站体验。</li>
            <li><strong>广告相关</strong>：本网站展示 Google AdSense 广告，Google 可能使用 Cookie 收集您的浏览信息以展示个性化广告。请参阅 <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google 广告政策</a>。</li>
            <li><strong>工具使用数据</strong>：本站提供的在线工具（如二维码生成、图片压缩等）均在浏览器本地运行，您的数据不会上传到服务器。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. Cookie 使用</h2>
          <p>本网站使用 Cookie 和类似技术：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>必要 Cookie</strong>：用于网站基本功能。</li>
            <li><strong>分析 Cookie</strong>：Google Analytics 使用 Cookie 分析网站流量。</li>
            <li><strong>广告 Cookie</strong>：Google AdSense 使用 Cookie 展示相关广告。您可以通过 <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google 广告设置</a> 管理广告偏好。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. 第三方服务</h2>
          <p>本网站使用以下第三方服务：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Google AdSense</strong>：用于展示广告。详情请参阅 <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google 隐私政策</a>。</li>
            <li><strong>Google Analytics</strong>：用于网站流量分析。</li>
            <li><strong>Vercel</strong>：用于网站托管。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">4. 数据安全</h2>
          <p>我们采取合理措施保护您的信息安全，包括使用 HTTPS 加密传输。所有在线工具均在浏览器本地运行，您的文件和数据不会上传到任何服务器。</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">5. 您的权利</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>访问我们持有的关于您的个人信息</li>
            <li>拒绝个性化广告（通过 Google 广告设置）</li>
            <li>在浏览器中禁用 Cookie</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">6. 儿童隐私</h2>
          <p>本网站不面向 13 岁以下儿童，我们不会有意收集儿童的个人信息。</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">7. 联系我们</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>网站：https://tools.fuye.qzz.io</li>
            <li>GitHub：https://github.com/acai8888</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
