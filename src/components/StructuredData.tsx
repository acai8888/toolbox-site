/**
 * 结构化数据组件 - JSON-LD 格式
 * 帮助搜索引擎更好地理解网站内容
 */
export default function StructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "万能工具箱",
    alternateName: "Toolbox",
    url: "https://tools.fuye.qzz.io",
    description: "一站式在线工具平台，提供多种实用在线工具、优质网站导航和免费资源下载。",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://tools.fuye.qzz.io/tools?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "万能工具箱",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CNY",
    },
    description: "一站式在线工具平台，提供二维码生成、图片压缩、JSON格式化等数十种实用工具。",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
    </>
  );
}
