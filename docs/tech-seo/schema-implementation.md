# 🏗️ Schema.org 結構化數據實施指南

## 📋 文檔資訊

**建立時間**: 2025-08-17T01:57:37+08:00  
**負責人**: 鐵漢阿強 (Iron Man Strong)  
**版本**: v1.0.0  
**技術標準**: Schema.org + JSON-LD  
**參考來源**: [Context7:Schema.org Official](https://github.com/schemaorg/schemaorg)

---

## 🎯 JSON-LD 實施標準

### 基礎 JSON-LD 結構

根據 Schema.org 最新標準，我們採用 JSON-LD 格式實施結構化數據：

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "ClickFun",
  "description": "免費線上點擊遊戲，支援PWA離線遊戲、TPS計算功能",
  "url": "https://haotool.github.io/clickfun/",
  "applicationCategory": "Game",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript. HTML5 compatible browser.",
  "inLanguage": "zh-TW",
  "isAccessibleForFree": true
}
```

---

## 🎮 WebApplication Schema 完整實施

### 主要 WebApplication 結構化數據

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://haotool.github.io/clickfun/",
  "name": "ClickFun",
  "alternateName": ["Click Fun", "clickfun", "點擊樂趣"],
  "description": "ClickFun 是免費線上點擊遊戲，支援 PWA 離線遊戲、TPS 即時計算、跨平台相容。現代化粉藍配色設計，提供最佳點擊體驗。",
  "url": "https://haotool.github.io/clickfun/",
  "sameAs": [
    "https://github.com/haotool/clickfun"
  ],
  
  "applicationCategory": "Game",
  "applicationSubCategory": "Casual Game",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript. HTML5 compatible browser.",
  "memoryRequirements": "64MB",
  "storageRequirements": "5MB",
  "processorRequirements": "Any modern processor",
  
  "inLanguage": ["zh-TW", "en"],
  "isAccessibleForFree": true,
  "accessibilityFeature": [
    "fullKeyboardControl",
    "fullTouchControl",
    "alternativeText"
  ],
  "accessibilityHazard": "noFlashingHazard",
  
  "featureList": [
    "離線 PWA 支援",
    "TPS (每秒點擊) 即時計算",
    "跨平台相容性",
    "現代化使用者介面",
    "無廣告體驗",
    "即時數據統計",
    "響應式設計",
    "一鍵安裝 PWA"
  ],
  
  "gamePlatform": [
    "Web Browser",
    "Progressive Web App",
    "Mobile Web",
    "Desktop Web"
  ],
  
  "genre": ["Casual", "Arcade", "Clicker"],
  "playMode": "SinglePlayer",
  "contentRating": {
    "@type": "Rating",
    "ratingValue": "Everyone",
    "bestRating": "Everyone",
    "author": {
      "@type": "Organization",
      "name": "Self-Rated"
    }
  },
  
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "validFrom": "2024-01-01",
    "category": "Free Game"
  },
  
  "author": {
    "@type": "Person",
    "name": "haotool",
    "@id": "https://github.com/haotool"
  },
  
  "publisher": {
    "@type": "Person",
    "name": "haotool",
    "@id": "https://github.com/haotool"
  },
  
  "creator": {
    "@type": "Person",
    "name": "haotool",
    "@id": "https://github.com/haotool"
  },
  
  "datePublished": "2024-01-01",
  "dateModified": "2025-08-17T01:57:37+08:00",
  "version": "7.1.2",
  
  "screenshot": [
    {
      "@type": "ImageObject",
      "url": "https://haotool.github.io/clickfun/icons/screenshot-main.png",
      "description": "ClickFun 主介面截圖",
      "width": "1200",
      "height": "800"
    },
    {
      "@type": "ImageObject", 
      "url": "https://haotool.github.io/clickfun/icons/screenshot-stats.png",
      "description": "TPS 統計介面截圖",
      "width": "1200",
      "height": "800"
    }
  ],
  
  "image": {
    "@type": "ImageObject",
    "url": "https://haotool.github.io/clickfun/icons/og-image-1200x630.png",
    "width": "1200",
    "height": "630",
    "description": "ClickFun 遊戲標誌和介面預覽"
  },
  
  "potentialAction": {
    "@type": "PlayAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://haotool.github.io/clickfun/",
      "actionPlatform": [
        "https://schema.org/DesktopWebPlatform",
        "https://schema.org/MobileWebPlatform"
      ]
    },
    "expectsAcceptanceOf": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  },
  
  "installUrl": "https://haotool.github.io/clickfun/",
  "downloadUrl": "https://haotool.github.io/clickfun/",
  
  "requirements": [
    "JavaScript enabled",
    "Modern web browser",
    "Internet connection (first load)"
  ],
  
  "supportingData": {
    "@type": "DataDownload",
    "name": "遊戲使用統計",
    "description": "用戶點擊數據統計"
  }
}
```

---

## 🌐 Website Schema 補充

### 主網站結構化數據

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://haotool.github.io/clickfun/#website",
  "name": "ClickFun - 點擊樂趣遊戲",
  "alternateName": "Click Fun Game",
  "url": "https://haotool.github.io/clickfun/",
  "description": "免費線上點擊遊戲網站，提供最佳的點擊體驗和 PWA 功能",
  "inLanguage": "zh-TW",
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://haotool.github.io/#website"
  },
  "about": {
    "@type": "WebApplication",
    "@id": "https://haotool.github.io/clickfun/"
  },
  "mainEntity": {
    "@type": "WebApplication",
    "@id": "https://haotool.github.io/clickfun/"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://haotool.github.io/clickfun/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Person",
    "name": "haotool",
    "@id": "https://github.com/haotool"
  },
  "copyrightHolder": {
    "@type": "Person",
    "name": "haotool"
  },
  "copyrightYear": "2024"
}
```

---

## ❓ FAQ Schema 實施

### 常見問題結構化數據

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://haotool.github.io/clickfun/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "什麼是 ClickFun？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ClickFun 是一款免費線上點擊遊戲，支援 PWA 離線遊戲功能，具備 TPS 即時計算、現代化介面設計，可在各種設備上運行。"
      }
    },
    {
      "@type": "Question", 
      "name": "如何安裝 ClickFun PWA？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "在支援的瀏覽器中訪問 ClickFun，瀏覽器會自動提示安裝選項。點擊地址欄的安裝圖示或使用瀏覽器選單中的「安裝應用程式」選項。"
      }
    },
    {
      "@type": "Question",
      "name": "TPS 是什麼意思？",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "TPS 代表 Taps Per Second（每秒點擊次數），是衡量點擊速度的指標。ClickFun 提供即時 TPS 計算，幫助您了解點擊表現。"
      }
    },
    {
      "@type": "Question",
      "name": "ClickFun 支援哪些平台？", 
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ClickFun 支援所有現代網頁瀏覽器，包括 Chrome、Firefox、Safari、Edge，同時支援 Android、iOS 行動裝置，具備完整的響應式設計。"
      }
    },
    {
      "@type": "Question",
      "name": "遊戲需要聯網嗎？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "初次載入需要網路連線，安裝為 PWA 後可離線遊戲。所有核心功能包括點擊計算、統計記錄都可在離線狀態下使用。"
      }
    },
    {
      "@type": "Question",
      "name": "如何提升點擊速度？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "建議使用食指快速連續點擊，保持手腕穩定，選擇適合的滑鼠或觸控設備。ClickFun 的即時 TPS 顯示能幫助您監控和改善表現。"
      }
    }
  ],
  "about": {
    "@type": "WebApplication",
    "@id": "https://haotool.github.io/clickfun/"
  },
  "isPartOf": {
    "@type": "WebSite", 
    "@id": "https://haotool.github.io/clickfun/#website"
  }
}
```

---

## 🏢 Organization Schema

### 開發者組織資訊

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://github.com/haotool",
  "name": "haotool",
  "url": "https://github.com/haotool",
  "sameAs": [
    "https://github.com/haotool"
  ],
  "jobTitle": "Web Developer",
  "knowsAbout": [
    "Web Development",
    "Progressive Web Apps",
    "JavaScript",
    "HTML5 Games"
  ],
  "owns": {
    "@type": "WebApplication",
    "@id": "https://haotool.github.io/clickfun/"
  },
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "Software Development"
  }
}
```

---

## 🛠️ 實施檢查清單

### JSON-LD 驗證標準

```yaml
Schema_Validation_Checklist:
  basic_structure:
    - "@context" 設為 "https://schema.org"
    - "@type" 正確設置
    - "@id" 使用標準化 URL
    - 所有必要屬性存在

  webapplication_schema:
    - name 和 alternateName 設置
    - description 詳細且吸引人
    - applicationCategory 為 "Game"  
    - featureList 完整列出功能
    - offers 價格設為免費
    - author/publisher 資訊完整

  technical_properties:
    - operatingSystem 設為 "Any"
    - browserRequirements 明確說明
    - inLanguage 包含 zh-TW
    - isAccessibleForFree 設為 true
    - 版本資訊最新

  faq_schema:
    - 至少 6 個高質量問答
    - 每個問題針對性強
    - 答案簡潔明確 (50-150字)
    - 涵蓋主要使用情境

  image_properties:
    - 所有圖片 URL 可訪問
    - 圖片尺寸符合規範
    - alt 描述完整
    - 多種尺寸圖片提供
```

### 自動化驗證腳本

```bash
#!/bin/bash
# Schema.org 結構化數據驗證

echo "🏗️ 開始 Schema.org 驗證..."

# 1. JSON-LD 語法驗證
echo "✅ 檢查 JSON-LD 語法..."
if node -e "JSON.parse(require('fs').readFileSync('structured-data.json', 'utf8'))" 2>/dev/null; then
    echo "✓ JSON 語法正確"
else
    echo "✗ JSON 語法錯誤"
    exit 1
fi

# 2. Schema.org 必要屬性檢查
echo "✅ 檢查必要 Schema 屬性..."
REQUIRED_PROPS=("@context" "@type" "name" "description" "url")

for prop in "${REQUIRED_PROPS[@]}"; do
    if grep -q "\"$prop\"" structured-data.json; then
        echo "✓ $prop 存在"
    else
        echo "✗ 缺少 $prop"
    fi
done

# 3. 圖片 URL 可訪問性檢查
echo "✅ 檢查圖片 URL..."
IMAGES=$(grep -o '"url": *"[^"]*\.png"' structured-data.json | cut -d'"' -f4)
for img in $IMAGES; do
    if curl -s --head "$img" | head -n 1 | grep -q "200 OK"; then
        echo "✓ 圖片可訪問: $img"
    else
        echo "⚠ 圖片無法訪問: $img"
    fi
done

# 4. Google Rich Results 測試
echo "✅ 準備 Rich Results 測試..."
echo "請訪問: https://search.google.com/test/rich-results"
echo "測試 URL: https://haotool.github.io/clickfun/"

echo "🎯 Schema.org 驗證完成"
```

---

## 📊 效能最佳化

### JSON-LD 載入策略

```html
<!-- ✅ 最佳實踐：將 JSON-LD 放在 head 中，但不阻塞渲染 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "ClickFun"
}
</script>

<!-- ✅ 大型 Schema 可使用延遲載入 -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    // ... 大型 FAQ 數據
  };
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
});
</script>
```

### 檔案大小控制

```yaml
Schema_Size_Limits:
  webapplication_schema: "< 8KB"
  faq_schema: "< 12KB"  
  total_structured_data: "< 25KB"
  
Optimization_Strategies:
  - 移除不必要的屬性
  - 壓縮 JSON 格式
  - 分離大型 Schema
  - 使用 CDN 加速
```

---

## 🚨 常見錯誤與修復

### 錯誤 1: Schema 類型不匹配

```json
// ❌ 錯誤
{
  "@type": "Game",  // 不是有效的 Schema.org 類型
  "name": "ClickFun"
}

// ✅ 正確
{
  "@type": "WebApplication",
  "applicationCategory": "Game",
  "name": "ClickFun"
}
```

### 錯誤 2: 缺少必要屬性

```json
// ❌ 錯誤 - WebApplication 缺少關鍵屬性
{
  "@type": "WebApplication",
  "name": "ClickFun"
}

// ✅ 正確 - 包含必要屬性
{
  "@type": "WebApplication", 
  "name": "ClickFun",
  "description": "點擊遊戲描述",
  "url": "https://haotool.github.io/clickfun/",
  "applicationCategory": "Game"
}
```

### 錯誤 3: URL 格式不規範

```json
// ❌ 錯誤
{
  "url": "clickfun/",  // 相對路徑
  "image": "/icon.png"  // 缺少域名
}

// ✅ 正確  
{
  "url": "https://haotool.github.io/clickfun/",
  "image": "https://haotool.github.io/clickfun/icons/icon.png"
}
```

---

## 📋 部署檢查清單

### 上線前驗證

- [ ] JSON-LD 語法驗證通過
- [ ] Google Rich Results Test 100% 通過
- [ ] Schema.org Validator 驗證無誤
- [ ] 所有圖片 URL 可正常訪問
- [ ] FAQ 問答內容完整且有價值
- [ ] 版本號和時間戳記更新
- [ ] 多語言支援設置正確
- [ ] 無障礙性屬性完整

### 定期維護

- [ ] 每月檢查結構化數據狀態
- [ ] 每季度更新功能列表
- [ ] 每半年檢查 Schema.org 標準更新
- [ ] 持續監控 Rich Results 表現

---

**文檔維護**: 鐵漢阿強 (Iron Man Strong)  
**最後更新**: 2025-08-17T01:57:37+08:00  
**Schema.org 版本**: Latest  
**驗證工具**: Google Rich Results Test, Schema.org Validator
