/**
 * 广告位组件 - 预留 Google AdSense 广告位置
 * 审核通过后，将 data-ad-client 和 data-ad-slot 替换为你的 AdSense 代码
 */

interface AdBannerProps {
  slot?: string;
  format?: "horizontal" | "vertical" | "rectangle" | "auto";
  className?: string;
}

export default function AdBanner({ slot = "auto", format = "horizontal", className = "" }: AdBannerProps) {
  const adClient = "ca-pub-XXXXXXXXXXXXXXXX";

  const sizeClass = {
    horizontal: "w-full h-24 md:h-[90px]",
    vertical: "w-[300px] h-[600px]",
    rectangle: "w-[336px] h-[280px]",
    auto: "w-full h-[90px]",
  }[format];

  return (
    <div className={`ad-container my-4 flex items-center justify-center ${sizeClass} ${className}`}>
      {/* 
        AdSense 审核通过后，取消下方注释并替换为你的广告代码：
        
        <ins className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      */}
      
      {/* 审核前的占位显示 - 审核通过后删除这个 div */}
      <div className="w-full h-full border border-dashed border-primary/20 rounded-lg flex items-center justify-center text-xs text-muted/40">
        Ad Space
      </div>
    </div>
  );
}
