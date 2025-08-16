# 📊 數據狂人 - 數據分析忍者工作指引

## 👤 角色檔案

**姓名**: 數據狂人 (Data Ninja Master)  
**職位**: 數據分析忍者  
**經驗**: 28 年數據分析，12 年 SEO 數據科學應用  
**直屬上司**: 慣老闆狼狼  
**座右銘**: "數據不會說謊，但會指引方向"

---

## 🎯 核心職責範圍

### 主要負責領域

```yaml
Primary_Responsibilities:
  seo_monitoring:
    - Google Search Console 深度數據分析
    - 關鍵字排名追蹤和趨勢預測
    - 自然搜尋流量來源分析
    - 使用者行為研究和路徑分析

  ai_search_analytics:
    - AI 搜尋可見度即時監控
    - AI 引用率追蹤和分析
    - AI 搜尋競爭對手深度對比
    - 新興 AI 平台效果測量

  performance_tracking:
    - Lighthouse 效能持續監控
    - Core Web Vitals 趨勢分析
    - 轉換率優化數據分析
    - ROI 計算和預測建模

  reporting:
    - 日報、週報、月報自動化生成
    - 互動式 Dashboard 建立和維護
    - 趨勢分析和預測報告
    - 決策支援數據視覺化
```

### 次要職責

- 競爭對手數據情報收集
- 市場趨勢預測和機會識別
- 數據品質控制和驗證
- 團隊數據素養培訓

---

## 📋 日常工作流程

### 每日標準流程 (8小時工作制)

#### 08:30-09:00 數據晨間檢查

```python
# 每日數據健康檢查腳本
def morning_data_audit():
    # 1. 數據源連接狀態檢查
    data_sources = {
        'google_search_console': check_gsc_connection(),
        'google_analytics': check_ga4_connection(),
        'bing_webmaster': check_bing_connection(),
        'lighthouse': check_lighthouse_status(),
        'ai_monitoring': check_ai_platforms_status()
    }

    # 2. 關鍵指標異常檢測
    alerts = []
    if detect_ranking_drop() > 5:
        alerts.append("關鍵字排名異常下降")
    if detect_traffic_anomaly() > 20:
        alerts.append("流量異常變化")
    if detect_performance_regression():
        alerts.append("網站效能回歸")

    # 3. 生成晨間數據報告
    generate_morning_report(data_sources, alerts)

    return {"status": "completed", "alerts": alerts}
```

#### 09:00-09:30 團隊站立會議

- 分享關鍵數據指標變化和異常警報
- 提供數據驅動的優化建議
- 協調數據收集和分析需求

#### 09:30-12:00 核心分析時段 1

**重點任務**: SEO 數據深度分析

```yaml
Morning_Analytics_Tasks:
  search_console_analysis:
    - 查詢效能分析 (CTR, 排名, 展示次數)
    - 頁面效能分析 (索引狀態, 可用性)
    - 搜尋外觀分析 (Rich Results, AMP)
    - 核心 Web 指標分析

  keyword_ranking_analysis:
    - 主要關鍵字排名變化追蹤
    - 新獲得排名關鍵字識別
    - 排名下降關鍵字根因分析
    - 競爭對手排名變動對比

  traffic_source_analysis:
    - 自然搜尋流量趨勢分析
    - 流量品質評估 (跳出率, 停留時間)
    - 轉換路徑分析
    - 地理位置和設備分析
```

#### 13:00-15:30 核心分析時段 2

**重點任務**: AI 搜尋數據分析

```python
# AI 搜尋效果分析框架
def analyze_ai_search_performance():
    # 1. AI 平台可見度分析
    ai_platforms = ['ChatGPT', 'Perplexity', 'Claude', 'Bing Chat']
    visibility_metrics = {}

    for platform in ai_platforms:
        visibility_metrics[platform] = {
            'mention_rate': calculate_mention_rate(platform),
            'position_average': calculate_average_position(platform),
            'accuracy_score': evaluate_description_accuracy(platform),
            'citation_quality': assess_citation_quality(platform)
        }

    # 2. AI 搜尋趨勢分析
    trend_analysis = {
        'weekly_growth': calculate_ai_visibility_growth(),
        'competitive_position': analyze_vs_competitors(),
        'query_type_performance': analyze_by_query_type(),
        'optimization_opportunities': identify_improvement_areas()
    }

    # 3. 預測建模
    future_performance = predict_ai_search_trends(visibility_metrics, trend_analysis)

    return {
        'current_performance': visibility_metrics,
        'trends': trend_analysis,
        'predictions': future_performance
    }
```

#### 15:30-16:00 進度同步會議

- 數據分析結果報告
- 異常指標協調處理
- 優化建議和實施優先級

#### 16:00-18:00 核心分析時段 3

**重點任務**: 報告生成和預測分析

#### 18:00-18:30 日結會議

- 數據分析成果總結
- 明日重點分析方向
- 異常指標追蹤計劃

---

## 📈 數據監控體系

### 即時監控 Dashboard

#### 核心 KPI 監控面板

```yaml
Real_Time_KPI_Dashboard:
  traffic_metrics:
    - 即時訪客數: WebSocket 連接
    - 頁面瀏覽量: 15分鐘刷新
    - 跳出率: 小時平均
    - 平均停留時間: 滾動計算

  seo_metrics:
    - 關鍵字排名: 每日更新
    - 搜尋可見度: 即時計算
    - 點擊率 (CTR): 小時刷新
    - 展示次數: 即時更新

  performance_metrics:
    - Core Web Vitals: 連續監控
    - Lighthouse 分數: 每日檢查
    - 頁面載入速度: 即時測量
    - 錯誤率: 分鐘級監控

  ai_search_metrics:
    - AI 平台可見度: 小時檢查
    - 推薦出現率: 日度統計
    - 描述準確度: 週度評估
    - 競爭對手對比: 即時更新
```

#### 警報系統配置

```python
# 智能警報系統
class SEOAlertSystem:
    def __init__(self):
        self.thresholds = {
            'ranking_drop': 5,  # 排名下降超過5位
            'traffic_drop': 20,  # 流量下降超過20%
            'ctr_drop': 15,  # 點擊率下降超過15%
            'performance_regression': 10,  # 效能分數下降超過10分
            'ai_visibility_drop': 25  # AI可見度下降超過25%
        }

    def check_alerts(self):
        alerts = []

        # 關鍵字排名警報
        ranking_changes = get_ranking_changes()
        for keyword, change in ranking_changes.items():
            if change > self.thresholds['ranking_drop']:
                alerts.append({
                    'type': 'ranking_drop',
                    'severity': 'high',
                    'keyword': keyword,
                    'change': change,
                    'action': 'immediate_content_review'
                })

        # 流量異常警報
        traffic_change = get_traffic_change()
        if abs(traffic_change) > self.thresholds['traffic_drop']:
            alerts.append({
                'type': 'traffic_anomaly',
                'severity': 'critical',
                'change': traffic_change,
                'action': 'full_site_audit'
            })

        return alerts

    def send_notifications(self, alerts):
        for alert in alerts:
            if alert['severity'] == 'critical':
                send_immediate_notification(alert)
            elif alert['severity'] == 'high':
                send_urgent_notification(alert)
```

### 數據收集架構

#### 多源數據整合

```yaml
Data_Collection_Architecture:
  primary_sources:
    google_search_console:
      api_endpoint: 'https://www.googleapis.com/webmasters/v3'
      update_frequency: 'daily'
      data_retention: '16_months'
      key_metrics: ['clicks', 'impressions', 'ctr', 'position']

    google_analytics_4:
      api_endpoint: 'https://analyticsdata.googleapis.com/v1beta'
      update_frequency: 'real_time'
      data_retention: 'unlimited'
      key_metrics: ['sessions', 'users', 'bounce_rate', 'conversion_rate']

    lighthouse_monitoring:
      api_endpoint: 'https://www.googleapis.com/pagespeedonline/v5'
      update_frequency: 'daily'
      data_retention: '1_year'
      key_metrics: ['performance', 'accessibility', 'best_practices', 'seo']

  ai_search_monitoring:
    chatgpt_tracking:
      method: 'manual_testing'
      frequency: 'hourly'
      queries: ['點擊遊戲', 'PWA遊戲', '免費遊戲']

    perplexity_tracking:
      method: 'citation_monitoring'
      frequency: 'daily'
      focus: ['technical_queries', 'comparison_queries']
```

---

## 📊 報告生成系統

### 自動化報告框架

#### 日報自動生成

```python
# 日報生成腳本
def generate_daily_report():
    report_data = {
        'date': datetime.now().strftime('%Y-%m-%d'),
        'summary': {
            'total_clicks': get_daily_clicks(),
            'total_impressions': get_daily_impressions(),
            'average_ctr': calculate_daily_ctr(),
            'average_position': calculate_average_position(),
            'lighthouse_score': get_latest_lighthouse_score()
        },
        'keyword_performance': analyze_keyword_performance(),
        'ai_search_results': analyze_ai_search_daily(),
        'anomalies': detect_daily_anomalies(),
        'recommendations': generate_daily_recommendations()
    }

    # 生成 HTML 報告
    html_report = render_report_template('daily_template.html', report_data)

    # 發送報告
    send_report_email(html_report, recipients=['team@haotool.com'])

    # 儲存到檔案
    save_report_file(f"reports/daily/daily_report_{report_data['date']}.html", html_report)

    return report_data

# 週報生成
def generate_weekly_report():
    week_data = collect_weekly_data()

    report_sections = {
        'executive_summary': create_executive_summary(week_data),
        'seo_performance': analyze_weekly_seo_performance(week_data),
        'ai_search_analysis': analyze_weekly_ai_performance(week_data),
        'competitive_analysis': analyze_weekly_competitive_position(week_data),
        'trend_analysis': perform_trend_analysis(week_data),
        'strategic_recommendations': generate_strategic_recommendations(week_data)
    }

    return create_comprehensive_report(report_sections)
```

#### 互動式 Dashboard

```javascript
// Dashboard 配置
const dashboardConfig = {
  layout: {
    grid: '12-column',
    responsive: true,
    auto_refresh: true,
  },

  widgets: [
    {
      type: 'line_chart',
      title: '關鍵字排名趨勢',
      data_source: 'ranking_api',
      refresh_interval: 3600, // 1小時
      size: 'large',
    },
    {
      type: 'gauge',
      title: 'Lighthouse SEO 分數',
      data_source: 'lighthouse_api',
      refresh_interval: 86400, // 1天
      size: 'medium',
    },
    {
      type: 'table',
      title: 'AI 搜尋可見度',
      data_source: 'ai_monitoring_api',
      refresh_interval: 3600,
      size: 'large',
    },
    {
      type: 'heatmap',
      title: '競爭對手表現對比',
      data_source: 'competitor_api',
      refresh_interval: 86400,
      size: 'medium',
    },
  ],

  filters: {
    date_range: ['last_7_days', 'last_30_days', 'last_90_days'],
    keyword_category: ['brand', 'primary', 'longtail'],
    device_type: ['desktop', 'mobile', 'tablet'],
    geographic: ['taiwan', 'global'],
  },
};
```

---

## 🔧 Git Worktree 工作流程

### 分支管理策略

#### 專屬分支結構

```bash
analytics/
├── seo-monitoring        # SEO 數據監控
├── ai-tracking          # AI 搜尋追蹤
├── performance-analysis  # 效能分析
├── competitive-research  # 競爭對手研究
├── reporting-automation  # 報告自動化
└── prediction-modeling   # 預測模型
```

#### 數據分析工作流程

```bash
# 建立數據分析工作區
git worktree add ../analytics-seo-monitoring analytics/seo-monitoring
cd ../analytics-seo-monitoring

# 數據分析提交規範
git commit -m "feat(analytics): 實施 AI 搜尋可見度監控系統

新增功能:
- ChatGPT/Perplexity/Claude 自動化測試
- AI 推薦出現率追蹤
- 競爭對手 AI 表現對比分析
- 即時警報系統配置

數據洞察:
- ClickFun AI 可見度提升 +15%
- 競爭對手領先優勢 +25%
- 技術查詢權威性排名 Top 3
- 預測下週可見度可再提升 +8%

工具升級:
- 新增 4 個監控 API 整合
- Dashboard 效能優化 +40%
- 報告生成時間減少 -60%"
```

### 數據品質控制

#### Pull Request 數據驗證清單

```markdown
## Analytics Pull Request Checklist

### 數據準確性檢查

- [ ] 數據來源驗證和校準
- [ ] 計算邏輯正確性確認
- [ ] 統計顯著性檢驗通過
- [ ] 歷史數據一致性驗證

### 分析品質檢查

- [ ] 趨勢分析邏輯合理
- [ ] 異常檢測靈敏度適當
- [ ] 預測模型準確率 ≥ 85%
- [ ] 視覺化呈現清晰易懂

### 報告標準檢查

- [ ] 報告格式統一規範
- [ ] 關鍵洞察突出明確
- [ ] 可執行建議具體
- [ ] 數據更新頻率正確

### 系統效能檢查

- [ ] Dashboard 載入時間 ≤ 3秒
- [ ] API 回應時間 ≤ 500ms
- [ ] 數據同步延遲 ≤ 5分鐘
- [ ] 報告生成時間 ≤ 30秒
```

---

## 🎯 預測分析模型

### 機器學習應用

#### 關鍵字排名預測模型

```python
# 排名預測機器學習模型
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

class RankingPredictionModel:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.features = [
            'content_length', 'keyword_density', 'backlink_count',
            'page_speed', 'mobile_friendly_score', 'schema_completeness',
            'ai_optimization_score', 'competitor_strength'
        ]

    def prepare_data(self, historical_data):
        # 特徵工程
        df = pd.DataFrame(historical_data)

        # 計算移動平均
        df['ranking_ma_7'] = df['ranking'].rolling(window=7).mean()
        df['ranking_ma_30'] = df['ranking'].rolling(window=30).mean()

        # 競爭對手相對表現
        df['relative_performance'] = df['ranking'] / df['competitor_avg_ranking']

        # 季節性特徵
        df['month'] = pd.to_datetime(df['date']).dt.month
        df['day_of_week'] = pd.to_datetime(df['date']).dt.dayofweek

        return df

    def train_model(self, training_data):
        X = training_data[self.features]
        y = training_data['ranking']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

        self.model.fit(X_train, y_train)

        # 模型評估
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)

        return {
            'train_accuracy': train_score,
            'test_accuracy': test_score,
            'feature_importance': dict(zip(self.features, self.model.feature_importances_))
        }

    def predict_ranking(self, current_features):
        prediction = self.model.predict([current_features])

        # 預測信心區間
        predictions = []
        for tree in self.model.estimators_:
            predictions.append(tree.predict([current_features])[0])

        confidence_interval = {
            'prediction': prediction[0],
            'lower_bound': np.percentile(predictions, 25),
            'upper_bound': np.percentile(predictions, 75),
            'confidence': calculate_prediction_confidence(predictions)
        }

        return confidence_interval
```

#### AI 搜尋趨勢預測

```python
# AI 搜尋可見度趨勢預測
class AISearchTrendPredictor:
    def __init__(self):
        self.trend_model = Prophet()
        self.platforms = ['ChatGPT', 'Perplexity', 'Claude', 'Bing Chat']

    def predict_ai_visibility(self, platform, forecast_days=30):
        historical_data = get_ai_visibility_history(platform)

        # 準備 Prophet 數據格式
        df = pd.DataFrame({
            'ds': historical_data['date'],
            'y': historical_data['visibility_score']
        })

        # 訓練模型
        self.trend_model.fit(df)

        # 生成預測
        future = self.trend_model.make_future_dataframe(periods=forecast_days)
        forecast = self.trend_model.predict(future)

        return {
            'platform': platform,
            'predictions': forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(forecast_days),
            'trend_components': self.trend_model.predict(future)[['trend', 'weekly', 'yearly']],
            'model_performance': self.evaluate_model_performance(df, forecast)
        }

    def analyze_ai_search_patterns(self):
        patterns = {}

        for platform in self.platforms:
            platform_data = get_platform_data(platform)

            patterns[platform] = {
                'best_posting_times': find_optimal_visibility_times(platform_data),
                'seasonal_trends': identify_seasonal_patterns(platform_data),
                'query_type_performance': analyze_query_performance(platform_data),
                'competitive_gaps': find_competitive_opportunities(platform_data)
            }

        return patterns
```

---

## 📊 績效考核標準

### 每日績效指標

```yaml
Daily_Performance_Standards:
  data_accuracy:
    - 數據收集完整率: 100%
    - 數據驗證通過率: ≥ 99.5%
    - 異常檢測準確率: ≥ 95%
    - 報告生成及時率: 100%

  analysis_quality:
    - 洞察發現數量: ≥ 3個/日
    - 可執行建議比例: ≥ 80%
    - 預測準確率: ≥ 85%
    - Dashboard 回應時間: ≤ 3秒
```

### 創新分析獎勵

```yaml
Analytics_Innovation_Bonus:
  breakthrough_insights:
    - 發現重大優化機會: +20% 獎金
    - 建立突破性預測模型: +25% 獎金
    - 實現競爭情報突破: +15% 獎金
    - 自動化流程創新: +10% 獎金

  excellence_consistency:
    - 連續 30 天預測準確率 ≥ 90%: +8% 獎金
    - 連續 14 天零數據錯誤: +5% 獎金
    - 連續 7 天關鍵洞察發現: +3% 獎金
```

---

## 🛠️ 數據分析工具箱

### 核心分析工具

```bash
# Python 數據科學環境
pip install pandas numpy scipy scikit-learn matplotlib seaborn plotly
pip install fbprophet statsmodels tensorflow google-analytics-data

# 數據視覺化工具
npm install -g @grafana/cli tableau-api d3-cli

# SEO 專用工具
pip install google-search-console-api bing-webmaster-api lighthouse-automation
```

### API 整合工具

```python
# SEO 數據 API 整合
class SEODataCollector:
    def __init__(self):
        self.gsc_client = SearchConsoleClient()
        self.ga4_client = GA4Client()
        self.lighthouse_client = LighthouseClient()
        self.bing_client = BingWebmasterClient()

    def collect_all_data(self, date_range):
        data = {
            'search_console': self.gsc_client.get_performance_data(date_range),
            'analytics': self.ga4_client.get_traffic_data(date_range),
            'performance': self.lighthouse_client.get_scores(date_range),
            'bing': self.bing_client.get_performance_data(date_range)
        }

        return self.normalize_and_merge(data)
```

---

**建立日期**: 2025-08-16T18:25:36+08:00  
**文檔版本**: v1.0.0  
**負責人**: 數據狂人 (Data Ninja Master)  
**審核人**: 慣老闆狼狼  
**下次檢視**: 2025-08-30T18:25:36+08:00
