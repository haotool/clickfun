#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自動化報告生成器 - 企業級 SEO 數據報告系統
建立時間: 2025-08-17T02:03:06+08:00
負責人: 數據狂人 (Data Ninja Master)
版本: v1.0.0

這個模組負責生成各種格式的 SEO 分析報告：
- 日報：每日關鍵指標摘要
- 週報：趨勢分析和競爭對手比較
- 月報：深度分析和策略建議
- 即時 Dashboard：互動式數據視覺化
"""

import asyncio
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any, Union
import json
import pandas as pd
import numpy as np
from dataclasses import dataclass, asdict
from jinja2 import Environment, FileSystemLoader, Template
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib.dates import DateFormatter
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import plotly.offline as pyo
from io import BytesIO
import base64

# 設置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 設置中文字體
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

# 設置 seaborn 樣式
sns.set_style("whitegrid")
sns.set_palette("husl")


@dataclass
class ReportConfig:
    """報告配置"""
    title: str
    subtitle: str
    author: str
    department: str
    report_type: str  # daily, weekly, monthly, realtime
    template_name: str
    output_format: str  # html, pdf, json
    include_charts: bool = True
    include_tables: bool = True
    include_recommendations: bool = True


@dataclass
class KeyMetrics:
    """關鍵指標數據結構"""
    total_clicks: int
    total_impressions: int
    average_ctr: float
    average_position: float
    lighthouse_seo_score: int
    lighthouse_performance_score: int
    ai_mention_rate: float
    trend_direction: str  # up, down, stable
    change_percentage: float


class ChartGenerator:
    """圖表生成器"""
    
    def __init__(self, style: str = 'plotly_white'):
        self.style = style
        
    def create_trend_chart(self, data: pd.DataFrame, title: str, 
                          x_col: str, y_col: str, color_col: Optional[str] = None) -> str:
        """創建趨勢圖表"""
        try:
            fig = go.Figure()
            
            if color_col and color_col in data.columns:
                # 多條線的趨勢圖
                for category in data[color_col].unique():
                    subset = data[data[color_col] == category]
                    fig.add_trace(go.Scatter(
                        x=subset[x_col],
                        y=subset[y_col],
                        mode='lines+markers',
                        name=str(category),
                        line=dict(width=3),
                        marker=dict(size=8)
                    ))
            else:
                # 單條線的趨勢圖
                fig.add_trace(go.Scatter(
                    x=data[x_col],
                    y=data[y_col],
                    mode='lines+markers',
                    name=y_col,
                    line=dict(width=3, color='#2E86AB'),
                    marker=dict(size=8, color='#A23B72')
                ))
            
            fig.update_layout(
                title=dict(text=title, font=dict(size=18, color='#2C3E50')),
                xaxis_title=x_col,
                yaxis_title=y_col,
                template=self.style,
                height=400,
                showlegend=True,
                hovermode='x unified'
            )
            
            return fig.to_html(include_plotlyjs='cdn', div_id=f"chart_{hash(title)}")
            
        except Exception as e:
            logger.error(f"創建趨勢圖表失敗: {str(e)}")
            return f"<p>圖表生成失敗: {str(e)}</p>"
    
    def create_performance_gauge(self, value: float, title: str, 
                               max_value: float = 100) -> str:
        """創建效能儀表板"""
        try:
            # 確定顏色
            if value >= 90:
                color = "green"
            elif value >= 70:
                color = "yellow"
            else:
                color = "red"
            
            fig = go.Figure(go.Indicator(
                mode="gauge+number+delta",
                value=value,
                title={'text': title, 'font': {'size': 16}},
                delta={'reference': 95, 'increasing': {'color': "green"}},
                gauge={
                    'axis': {'range': [None, max_value]},
                    'bar': {'color': color},
                    'steps': [
                        {'range': [0, 50], 'color': "lightgray"},
                        {'range': [50, 80], 'color': "gray"},
                        {'range': [80, max_value], 'color': "lightgreen"}
                    ],
                    'threshold': {
                        'line': {'color': "red", 'width': 4},
                        'thickness': 0.75,
                        'value': 90
                    }
                }
            ))
            
            fig.update_layout(height=300, template=self.style)
            
            return fig.to_html(include_plotlyjs='cdn', div_id=f"gauge_{hash(title)}")
            
        except Exception as e:
            logger.error(f"創建儀表板失敗: {str(e)}")
            return f"<p>儀表板生成失敗: {str(e)}</p>"
    
    def create_comparison_bar_chart(self, data: Dict[str, float], 
                                  title: str, color_scheme: str = 'viridis') -> str:
        """創建比較條形圖"""
        try:
            fig = go.Figure(data=[
                go.Bar(
                    x=list(data.keys()),
                    y=list(data.values()),
                    marker_color=px.colors.qualitative.Set2
                )
            ])
            
            fig.update_layout(
                title=dict(text=title, font=dict(size=18, color='#2C3E50')),
                xaxis_title="平台",
                yaxis_title="數值",
                template=self.style,
                height=400,
                showlegend=False
            )
            
            # 添加數值標籤
            for i, (key, value) in enumerate(data.items()):
                fig.add_annotation(
                    x=key,
                    y=value,
                    text=f"{value:.1f}",
                    showarrow=False,
                    yshift=10
                )
            
            return fig.to_html(include_plotlyjs='cdn', div_id=f"bar_{hash(title)}")
            
        except Exception as e:
            logger.error(f"創建條形圖失敗: {str(e)}")
            return f"<p>條形圖生成失敗: {str(e)}</p>"
    
    def create_ai_search_heatmap(self, data: pd.DataFrame) -> str:
        """創建 AI 搜尋熱圖"""
        try:
            # 準備熱圖數據
            heatmap_data = data.pivot_table(
                values='accuracy_score',
                index='platform',
                columns='query',
                aggfunc='mean'
            ).fillna(0)
            
            fig = go.Figure(data=go.Heatmap(
                z=heatmap_data.values,
                x=heatmap_data.columns,
                y=heatmap_data.index,
                colorscale='RdYlGn',
                showscale=True,
                colorbar=dict(title="準確度分數")
            ))
            
            fig.update_layout(
                title=dict(text="AI 搜尋平台準確度熱圖", font=dict(size=18, color='#2C3E50')),
                xaxis_title="查詢類型",
                yaxis_title="AI 平台",
                template=self.style,
                height=400
            )
            
            return fig.to_html(include_plotlyjs='cdn', div_id="ai_heatmap")
            
        except Exception as e:
            logger.error(f"創建熱圖失敗: {str(e)}")
            return f"<p>熱圖生成失敗: {str(e)}</p>"


class DataAnalyzer:
    """數據分析器"""
    
    @staticmethod
    def calculate_trend(data: List[float], period: int = 7) -> Dict[str, Union[str, float]]:
        """計算趨勢"""
        if len(data) < 2:
            return {"direction": "stable", "change_percentage": 0.0}
        
        recent_avg = np.mean(data[-period:]) if len(data) >= period else np.mean(data)
        previous_avg = np.mean(data[:-period]) if len(data) >= period * 2 else data[0]
        
        if recent_avg > previous_avg * 1.05:
            direction = "up"
        elif recent_avg < previous_avg * 0.95:
            direction = "down"
        else:
            direction = "stable"
        
        change_percentage = ((recent_avg - previous_avg) / previous_avg * 100) if previous_avg != 0 else 0
        
        return {
            "direction": direction,
            "change_percentage": round(change_percentage, 2)
        }
    
    @staticmethod
    def generate_insights(metrics: KeyMetrics) -> List[str]:
        """生成數據洞察"""
        insights = []
        
        # CTR 分析
        if metrics.average_ctr > 0.1:
            insights.append("🎯 點擊率表現優秀，超過 10%，顯示內容與用戶需求高度匹配")
        elif metrics.average_ctr < 0.05:
            insights.append("⚠️ 點擊率偏低，建議優化標題和描述提升吸引力")
        
        # 排名分析
        if metrics.average_position <= 3:
            insights.append("🏆 平均排名優秀，維持在前 3 位，有利於獲得更多流量")
        elif metrics.average_position > 10:
            insights.append("📈 平均排名需要改善，建議加強內容優化和外鏈建設")
        
        # AI 搜尋分析
        if metrics.ai_mention_rate > 0.8:
            insights.append("🤖 AI 搜尋可見度極佳，在新型搜尋引擎中表現突出")
        elif metrics.ai_mention_rate < 0.5:
            insights.append("🔍 AI 搜尋可見度需要提升，建議優化 llms.txt 和結構化數據")
        
        # 效能分析
        if metrics.lighthouse_seo_score == 100:
            insights.append("⚡ SEO 技術實施完美，Lighthouse 評分滿分")
        
        # 趨勢分析
        if metrics.trend_direction == "up" and metrics.change_percentage > 10:
            insights.append(f"📊 整體表現呈上升趨勢，較前期增長 {metrics.change_percentage:.1f}%")
        elif metrics.trend_direction == "down" and metrics.change_percentage < -10:
            insights.append(f"📉 需要關注下降趨勢，較前期下降 {abs(metrics.change_percentage):.1f}%")
        
        return insights
    
    @staticmethod
    def generate_recommendations(metrics: KeyMetrics) -> List[Dict[str, str]]:
        """生成改善建議"""
        recommendations = []
        
        # 基於 CTR 的建議
        if metrics.average_ctr < 0.08:
            recommendations.append({
                "category": "內容優化",
                "priority": "高",
                "title": "優化標題和描述",
                "description": "當前 CTR 為 {:.2f}%，建議重新撰寫更吸引人的標題和描述".format(metrics.average_ctr * 100),
                "action": "使用 A/B 測試不同的標題格式，添加行動呼籲詞語"
            })
        
        # 基於排名的建議
        if metrics.average_position > 5:
            recommendations.append({
                "category": "SEO 優化",
                "priority": "高",
                "title": "提升關鍵字排名",
                "description": "當前平均排名為 {:.1f}，需要加強內容深度和技術優化".format(metrics.average_position),
                "action": "增加長尾關鍵字內容，建立更多高質量反向連結"
            })
        
        # 基於 AI 搜尋的建議
        if metrics.ai_mention_rate < 0.7:
            recommendations.append({
                "category": "AI SEO",
                "priority": "中",
                "title": "強化 AI 搜尋可見度",
                "description": "AI 平台提及率為 {:.1f}%，有改善空間".format(metrics.ai_mention_rate * 100),
                "action": "優化 llms.txt 內容，增加 FAQ 結構化數據，提升內容的 AI 友好性"
            })
        
        # 基於效能的建議
        if metrics.lighthouse_performance_score < 90:
            recommendations.append({
                "category": "技術優化",
                "priority": "中",
                "title": "提升頁面載入效能",
                "description": "Lighthouse 效能評分為 {}，影響用戶體驗和 SEO".format(metrics.lighthouse_performance_score),
                "action": "優化圖片大小，啟用快取策略，減少 JavaScript 阻塞"
            })
        
        return recommendations


class ReportGenerator:
    """報告生成器主類"""
    
    def __init__(self, templates_dir: str = "templates", output_dir: str = "reports"):
        self.templates_dir = Path(templates_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # 初始化 Jinja2 環境
        self.jinja_env = Environment(
            loader=FileSystemLoader(self.templates_dir),
            autoescape=True
        )
        
        # 初始化圖表生成器和數據分析器
        self.chart_generator = ChartGenerator()
        self.data_analyzer = DataAnalyzer()
        
        # 創建預設模板
        self.create_default_templates()
    
    def create_default_templates(self):
        """創建預設報告模板"""
        self.templates_dir.mkdir(parents=True, exist_ok=True)
        
        # 日報模板
        daily_template = '''
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background-color: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2E86AB; padding-bottom: 20px; }
        .header h1 { color: #2C3E50; margin: 0; font-size: 28px; }
        .header p { color: #7F8C8D; margin: 5px 0; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .metric-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }
        .metric-card h3 { margin: 0 0 10px 0; font-size: 14px; opacity: 0.9; }
        .metric-card .value { font-size: 32px; font-weight: bold; margin: 10px 0; }
        .metric-card .change { font-size: 14px; opacity: 0.8; }
        .section { margin: 40px 0; }
        .section h2 { color: #2C3E50; border-left: 4px solid #2E86AB; padding-left: 15px; }
        .insights { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .insights li { margin: 10px 0; }
        .recommendations { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #7F8C8D; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ title }}</h1>
            <p>{{ subtitle }}</p>
            <p>報告日期: {{ report_date }} | 負責人: {{ author }}</p>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <h3>總點擊數</h3>
                <div class="value">{{ metrics.total_clicks | default(0) }}</div>
                <div class="change">{{ metrics.change_percentage }}%</div>
            </div>
            <div class="metric-card">
                <h3>總展示次數</h3>
                <div class="value">{{ metrics.total_impressions | default(0) }}</div>
                <div class="change">vs 昨日</div>
            </div>
            <div class="metric-card">
                <h3>平均點擊率</h3>
                <div class="value">{{ "%.2f" | format(metrics.average_ctr * 100) }}%</div>
                <div class="change">CTR</div>
            </div>
            <div class="metric-card">
                <h3>平均排名</h3>
                <div class="value">{{ "%.1f" | format(metrics.average_position) }}</div>
                <div class="change">{{ metrics.trend_direction }}</div>
            </div>
        </div>
        
        {% if charts %}
        <div class="section">
            <h2>📊 數據視覺化</h2>
            {% for chart in charts %}
                {{ chart | safe }}
            {% endfor %}
        </div>
        {% endif %}
        
        {% if insights %}
        <div class="section">
            <h2>💡 關鍵洞察</h2>
            <div class="insights">
                <ul>
                {% for insight in insights %}
                    <li>{{ insight }}</li>
                {% endfor %}
                </ul>
            </div>
        </div>
        {% endif %}
        
        {% if recommendations %}
        <div class="section">
            <h2>🎯 改善建議</h2>
            <div class="recommendations">
                {% for rec in recommendations %}
                <div style="margin-bottom: 15px;">
                    <strong>{{ rec.title }}</strong> ({{ rec.category }} - {{ rec.priority }}優先級)
                    <p>{{ rec.description }}</p>
                    <em>行動方案: {{ rec.action }}</em>
                </div>
                {% endfor %}
            </div>
        </div>
        {% endif %}
        
        <div class="footer">
            <p>數據狂人 (Data Ninja Master) | ClickFun SEO 分析系統 | {{ report_date }}</p>
        </div>
    </div>
</body>
</html>
        '''
        
        # 儲存日報模板
        daily_template_path = self.templates_dir / "daily_report.html"
        with open(daily_template_path, 'w', encoding='utf-8') as f:
            f.write(daily_template)
        
        logger.info("已創建預設報告模板")
    
    def generate_daily_report(self, data: Dict[str, Any], config: ReportConfig) -> str:
        """生成日報"""
        try:
            # 準備報告數據
            report_data = {
                'title': config.title,
                'subtitle': config.subtitle,
                'author': config.author,
                'report_date': datetime.now().strftime('%Y-%m-%d'),
                'metrics': data.get('metrics', {}),
                'charts': [],
                'insights': [],
                'recommendations': []
            }
            
            # 生成圖表
            if config.include_charts and 'time_series_data' in data:
                # 趨勢圖表
                df = pd.DataFrame(data['time_series_data'])
                if not df.empty:
                    trend_chart = self.chart_generator.create_trend_chart(
                        df, "7 日點擊數趨勢", "date", "clicks"
                    )
                    report_data['charts'].append(trend_chart)
                    
                    # 效能儀表板
                    if 'lighthouse_score' in data['metrics']:
                        gauge_chart = self.chart_generator.create_performance_gauge(
                            data['metrics']['lighthouse_score'], 
                            "Lighthouse SEO 評分"
                        )
                        report_data['charts'].append(gauge_chart)
            
            # 生成洞察
            if 'metrics' in data:
                metrics = KeyMetrics(**data['metrics'])
                insights = self.data_analyzer.generate_insights(metrics)
                report_data['insights'] = insights
                
                # 生成建議
                if config.include_recommendations:
                    recommendations = self.data_analyzer.generate_recommendations(metrics)
                    report_data['recommendations'] = recommendations
            
            # 渲染報告
            template = self.jinja_env.get_template(config.template_name)
            html_content = template.render(**report_data)
            
            # 儲存報告
            output_file = self.output_dir / f"daily_report_{datetime.now().strftime('%Y%m%d')}.html"
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            logger.info(f"日報生成成功: {output_file}")
            return str(output_file)
            
        except Exception as e:
            logger.error(f"生成日報失敗: {str(e)}")
            raise
    
    def generate_weekly_report(self, data: Dict[str, Any], config: ReportConfig) -> str:
        """生成週報"""
        # 週報的實施類似日報，但包含更多趨勢分析
        # 這裡先返回基本實施
        return self.generate_daily_report(data, config)
    
    def generate_monthly_report(self, data: Dict[str, Any], config: ReportConfig) -> str:
        """生成月報"""
        # 月報包含深度分析和策略建議
        # 這裡先返回基本實施
        return self.generate_daily_report(data, config)
    
    def create_dashboard_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """創建 Dashboard 數據"""
        try:
            dashboard_data = {
                'timestamp': datetime.now().isoformat(),
                'metrics': data.get('metrics', {}),
                'charts': {
                    'trend_data': data.get('time_series_data', []),
                    'ai_search_data': data.get('ai_search_data', []),
                    'performance_data': data.get('performance_data', [])
                },
                'alerts': self.check_alerts(data.get('metrics', {})),
                'summary': self.generate_summary(data.get('metrics', {}))
            }
            
            # 儲存 Dashboard 數據
            dashboard_file = self.output_dir / "dashboard_data.json"
            with open(dashboard_file, 'w', encoding='utf-8') as f:
                json.dump(dashboard_data, f, indent=2, ensure_ascii=False, default=str)
            
            logger.info("Dashboard 數據生成成功")
            return dashboard_data
            
        except Exception as e:
            logger.error(f"創建 Dashboard 數據失敗: {str(e)}")
            return {}
    
    def check_alerts(self, metrics: Dict[str, Any]) -> List[Dict[str, str]]:
        """檢查警報條件"""
        alerts = []
        
        # 檢查點擊率警報
        if metrics.get('average_ctr', 0) < 0.03:
            alerts.append({
                "type": "warning",
                "title": "點擊率過低",
                "message": f"當前 CTR 為 {metrics.get('average_ctr', 0):.2%}，低於正常水平",
                "action": "建議優化標題和描述"
            })
        
        # 檢查排名警報
        if metrics.get('average_position', 0) > 10:
            alerts.append({
                "type": "error",
                "title": "排名下降嚴重",
                "message": f"平均排名為 {metrics.get('average_position', 0):.1f}，需要立即關注",
                "action": "檢查內容品質和技術 SEO"
            })
        
        # 檢查效能警報
        if metrics.get('lighthouse_performance_score', 100) < 80:
            alerts.append({
                "type": "warning", 
                "title": "頁面效能待改善",
                "message": f"Lighthouse 效能評分為 {metrics.get('lighthouse_performance_score', 100)}",
                "action": "優化載入速度和 Core Web Vitals"
            })
        
        return alerts
    
    def generate_summary(self, metrics: Dict[str, Any]) -> str:
        """生成摘要"""
        total_clicks = metrics.get('total_clicks', 0)
        ctr = metrics.get('average_ctr', 0)
        position = metrics.get('average_position', 0)
        
        if total_clicks > 100 and ctr > 0.08 and position <= 5:
            return "🎉 整體表現優秀，各項指標均達到理想水平"
        elif total_clicks > 50 and ctr > 0.05:
            return "📈 表現良好，仍有進一步優化空間"
        else:
            return "⚠️ 需要加強優化，重點關注內容品質和技術實施"


# 使用範例
async def main():
    """主函數範例"""
    # 初始化報告生成器
    generator = ReportGenerator()
    
    # 模擬數據
    sample_data = {
        'metrics': {
            'total_clicks': 150,
            'total_impressions': 2000,
            'average_ctr': 0.075,
            'average_position': 4.2,
            'lighthouse_seo_score': 100,
            'lighthouse_performance_score': 95,
            'ai_mention_rate': 0.8,
            'trend_direction': 'up',
            'change_percentage': 12.5
        },
        'time_series_data': [
            {'date': '2025-08-10', 'clicks': 120, 'impressions': 1800},
            {'date': '2025-08-11', 'clicks': 135, 'impressions': 1900},
            {'date': '2025-08-12', 'clicks': 145, 'impressions': 1950},
            {'date': '2025-08-13', 'clicks': 160, 'impressions': 2100},
            {'date': '2025-08-14', 'clicks': 155, 'impressions': 2050},
            {'date': '2025-08-15', 'clicks': 170, 'impressions': 2200},
            {'date': '2025-08-16', 'clicks': 180, 'impressions': 2300}
        ]
    }
    
    # 配置報告
    config = ReportConfig(
        title="ClickFun SEO 每日分析報告",
        subtitle="數據驅動的 SEO 效果監控與優化建議",
        author="數據狂人 (Data Ninja Master)",
        department="ClickFun SEO 團隊",
        report_type="daily",
        template_name="daily_report.html",
        output_format="html",
        include_charts=True,
        include_tables=True,
        include_recommendations=True
    )
    
    # 生成報告
    report_file = generator.generate_daily_report(sample_data, config)
    print(f"報告已生成: {report_file}")
    
    # 創建 Dashboard 數據
    dashboard_data = generator.create_dashboard_data(sample_data)
    print(f"Dashboard 數據已更新")


if __name__ == "__main__":
    asyncio.run(main())
