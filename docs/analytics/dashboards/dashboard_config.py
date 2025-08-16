#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEO Dashboard 配置與管理 - 即時監控儀表板系統
建立時間: 2025-08-17T02:03:06+08:00
負責人: 數據狂人 (Data Ninja Master)
版本: v1.0.0

這個模組提供 SEO 數據的即時儀表板配置：
- 即時數據更新
- 多維度數據視覺化
- 自定義儀表板布局
- 告警系統整合
- 響應式設計
"""

import json
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, asdict
from abc import ABC, abstractmethod

# 設置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class WidgetConfig:
    """儀表板小工具配置"""
    widget_id: str
    widget_type: str  # chart, table, metric, gauge, heatmap
    title: str
    data_source: str
    refresh_interval: int  # 秒
    position: Dict[str, int]  # {x, y, width, height}
    style: Dict[str, Any]
    filters: Optional[Dict[str, Any]] = None
    alerts: Optional[List[Dict[str, Any]]] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """轉換為字典格式"""
        return asdict(self)


@dataclass
class DashboardLayout:
    """儀表板布局配置"""
    dashboard_id: str
    title: str
    description: str
    widgets: List[WidgetConfig]
    global_refresh_interval: int
    auto_refresh: bool
    theme: str  # light, dark, auto
    responsive: bool
    created_at: datetime
    updated_at: datetime
    
    def to_dict(self) -> Dict[str, Any]:
        """轉換為字典格式"""
        data = asdict(self)
        data['widgets'] = [widget.to_dict() for widget in self.widgets]
        return data


class DashboardDataSource(ABC):
    """儀表板數據源基礎類別"""
    
    def __init__(self, source_id: str, config: Dict[str, Any]):
        self.source_id = source_id
        self.config = config
        self.last_update = None
        self.cache_duration = config.get('cache_duration', 300)  # 5分鐘
        self.cached_data = None
    
    @abstractmethod
    async def fetch_data(self, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """獲取數據"""
        pass
    
    async def get_data(self, filters: Optional[Dict[str, Any]] = None, use_cache: bool = True) -> Dict[str, Any]:
        """獲取數據（含快取處理）"""
        now = datetime.now()
        
        # 檢查快取是否有效
        if (use_cache and self.cached_data is not None and 
            self.last_update is not None and
            (now - self.last_update).total_seconds() < self.cache_duration):
            logger.debug(f"使用快取數據: {self.source_id}")
            return self.cached_data
        
        # 獲取新數據
        try:
            logger.info(f"獲取新數據: {self.source_id}")
            data = await self.fetch_data(filters)
            
            # 更新快取
            self.cached_data = data
            self.last_update = now
            
            return data
            
        except Exception as e:
            logger.error(f"獲取數據失敗 {self.source_id}: {str(e)}")
            
            # 如果有快取數據，返回快取
            if self.cached_data is not None:
                logger.warning(f"使用過期快取數據: {self.source_id}")
                return self.cached_data
            
            # 否則返回空數據
            return {}


class SEOMetricsDataSource(DashboardDataSource):
    """SEO 指標數據源"""
    
    async def fetch_data(self, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """獲取 SEO 指標數據"""
        # 模擬數據獲取
        import numpy as np
        
        current_time = datetime.now()
        
        # 生成模擬的 SEO 指標
        data = {
            'timestamp': current_time.isoformat(),
            'metrics': {
                'total_clicks': np.random.randint(100, 300),
                'total_impressions': np.random.randint(1000, 3000),
                'average_ctr': np.random.uniform(0.05, 0.15),
                'average_position': np.random.uniform(3, 12),
                'lighthouse_seo_score': 100,
                'lighthouse_performance_score': np.random.randint(85, 100),
                'pages_indexed': np.random.randint(5, 15),
                'core_web_vitals_lcp': np.random.uniform(1.2, 2.5),
                'core_web_vitals_cls': np.random.uniform(0.05, 0.15)
            },
            'trends': {
                'clicks_trend': np.random.choice(['up', 'down', 'stable'], p=[0.4, 0.3, 0.3]),
                'impressions_trend': np.random.choice(['up', 'down', 'stable'], p=[0.4, 0.3, 0.3]),
                'ctr_trend': np.random.choice(['up', 'down', 'stable'], p=[0.4, 0.3, 0.3]),
                'position_trend': np.random.choice(['up', 'down', 'stable'], p=[0.4, 0.3, 0.3])
            },
            'top_keywords': [
                {'keyword': 'ClickFun', 'position': 1, 'clicks': 50, 'impressions': 200},
                {'keyword': '點擊遊戲', 'position': 4, 'clicks': 30, 'impressions': 400},
                {'keyword': 'PWA遊戲', 'position': 6, 'clicks': 20, 'impressions': 300},
                {'keyword': '免費遊戲', 'position': 8, 'clicks': 15, 'impressions': 250},
                {'keyword': '點擊速度測試', 'position': 12, 'clicks': 10, 'impressions': 180}
            ]
        }
        
        return data


class AISearchDataSource(DashboardDataSource):
    """AI 搜尋數據源"""
    
    async def fetch_data(self, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """獲取 AI 搜尋數據"""
        import numpy as np
        
        current_time = datetime.now()
        
        platforms = ['ChatGPT', 'Perplexity', 'Claude', 'Bing Chat']
        queries = ['推薦點擊遊戲', '免費PWA遊戲', 'ClickFun是什麼', '點擊速度測試']
        
        platform_data = {}
        for platform in platforms:
            platform_data[platform] = {
                'mention_rate': np.random.uniform(0.6, 0.9),
                'accuracy_score': np.random.uniform(0.7, 0.95),
                'average_position': np.random.uniform(1, 5),
                'response_quality': np.random.uniform(0.8, 0.95)
            }
        
        query_performance = {}
        for query in queries:
            query_performance[query] = {
                'total_tests': len(platforms),
                'mentions': np.random.randint(2, 4),
                'average_accuracy': np.random.uniform(0.7, 0.9)
            }
        
        data = {
            'timestamp': current_time.isoformat(),
            'summary': {
                'overall_mention_rate': np.random.uniform(0.65, 0.85),
                'average_accuracy': np.random.uniform(0.75, 0.9),
                'total_platforms': len(platforms),
                'total_queries_tested': len(queries)
            },
            'platform_performance': platform_data,
            'query_performance': query_performance,
            'trending_platforms': ['ChatGPT', 'Perplexity'],  # 表現最好的平台
            'improvement_areas': ['Claude', 'Bing Chat']  # 需要改善的平台
        }
        
        return data


class CompetitorDataSource(DashboardDataSource):
    """競爭對手數據源"""
    
    async def fetch_data(self, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """獲取競爭對手數據"""
        import numpy as np
        
        competitors = [
            'Click Speed Test',
            'Pointer Game',
            'Mouse Clicker',
            'Online Click Test'
        ]
        
        competitor_data = {}
        for competitor in competitors:
            competitor_data[competitor] = {
                'estimated_traffic': np.random.randint(500, 5000),
                'average_position': np.random.uniform(2, 15),
                'keyword_overlap': np.random.uniform(0.3, 0.8),
                'domain_authority': np.random.randint(30, 80),
                'backlinks': np.random.randint(100, 2000)
            }
        
        data = {
            'timestamp': datetime.now().isoformat(),
            'competitors': competitor_data,
            'market_share': {
                'ClickFun': 15,
                'Click Speed Test': 25,
                'Pointer Game': 20,
                'Mouse Clicker': 18,
                'Online Click Test': 12,
                'Others': 10
            },
            'opportunity_keywords': [
                {'keyword': '線上點擊測試', 'difficulty': 0.4, 'volume': 800},
                {'keyword': 'TPS計算器', 'difficulty': 0.3, 'volume': 500},
                {'keyword': '手機點擊遊戲', 'difficulty': 0.5, 'volume': 1200}
            ]
        }
        
        return data


class DashboardManager:
    """儀表板管理器"""
    
    def __init__(self, config_dir: str = "dashboard_configs"):
        self.config_dir = Path(config_dir)
        self.config_dir.mkdir(parents=True, exist_ok=True)
        
        # 數據源註冊
        self.data_sources = {
            'seo_metrics': SEOMetricsDataSource('seo_metrics', {}),
            'ai_search': AISearchDataSource('ai_search', {}),
            'competitors': CompetitorDataSource('competitors', {})
        }
        
        # 預設儀表板配置
        self.default_dashboards = self.create_default_dashboards()
    
    def create_default_dashboards(self) -> Dict[str, DashboardLayout]:
        """創建預設儀表板配置"""
        dashboards = {}
        
        # 主監控儀表板
        main_widgets = [
            WidgetConfig(
                widget_id="main_metrics",
                widget_type="metric",
                title="核心 SEO 指標",
                data_source="seo_metrics",
                refresh_interval=300,
                position={"x": 0, "y": 0, "width": 12, "height": 3},
                style={
                    "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "color": "white",
                    "border_radius": "10px"
                }
            ),
            WidgetConfig(
                widget_id="traffic_trend",
                widget_type="chart",
                title="流量趨勢",
                data_source="seo_metrics",
                refresh_interval=300,
                position={"x": 0, "y": 3, "width": 8, "height": 4},
                style={
                    "chart_type": "line",
                    "theme": "modern"
                }
            ),
            WidgetConfig(
                widget_id="performance_gauge",
                widget_type="gauge",
                title="Lighthouse SEO 評分",
                data_source="seo_metrics",
                refresh_interval=600,
                position={"x": 8, "y": 3, "width": 4, "height": 4},
                style={
                    "gauge_type": "circular",
                    "color_scheme": "green_yellow_red"
                }
            ),
            WidgetConfig(
                widget_id="top_keywords",
                widget_type="table",
                title="熱門關鍵字",
                data_source="seo_metrics",
                refresh_interval=600,
                position={"x": 0, "y": 7, "width": 6, "height": 4},
                style={
                    "table_style": "modern",
                    "row_hover": True
                }
            ),
            WidgetConfig(
                widget_id="ai_search_summary",
                widget_type="chart",
                title="AI 搜尋可見度",
                data_source="ai_search",
                refresh_interval=900,
                position={"x": 6, "y": 7, "width": 6, "height": 4},
                style={
                    "chart_type": "radar",
                    "fill_opacity": 0.3
                }
            )
        ]
        
        dashboards['main'] = DashboardLayout(
            dashboard_id="main",
            title="ClickFun SEO 主監控儀表板",
            description="全面監控 ClickFun 的 SEO 表現和關鍵指標",
            widgets=main_widgets,
            global_refresh_interval=300,
            auto_refresh=True,
            theme="light",
            responsive=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        # AI SEO 專門儀表板
        ai_widgets = [
            WidgetConfig(
                widget_id="ai_platform_performance",
                widget_type="chart",
                title="AI 平台表現比較",
                data_source="ai_search",
                refresh_interval=600,
                position={"x": 0, "y": 0, "width": 8, "height": 5},
                style={
                    "chart_type": "bar",
                    "color_scheme": "viridis"
                }
            ),
            WidgetConfig(
                widget_id="ai_mention_gauge",
                widget_type="gauge",
                title="整體提及率",
                data_source="ai_search",
                refresh_interval=600,
                position={"x": 8, "y": 0, "width": 4, "height": 5},
                style={
                    "gauge_type": "semicircle",
                    "target_value": 0.8
                }
            ),
            WidgetConfig(
                widget_id="query_heatmap",
                widget_type="heatmap",
                title="查詢類型 × 平台表現熱圖",
                data_source="ai_search",
                refresh_interval=900,
                position={"x": 0, "y": 5, "width": 12, "height": 4},
                style={
                    "color_scale": "RdYlGn"
                }
            ),
            WidgetConfig(
                widget_id="ai_improvements",
                widget_type="table",
                title="改善建議",
                data_source="ai_search",
                refresh_interval=1800,
                position={"x": 0, "y": 9, "width": 12, "height": 3},
                style={
                    "show_priorities": True,
                    "highlight_high_priority": True
                }
            )
        ]
        
        dashboards['ai_seo'] = DashboardLayout(
            dashboard_id="ai_seo",
            title="AI SEO 專門監控",
            description="專注於 AI 搜尋引擎的可見度和表現分析",
            widgets=ai_widgets,
            global_refresh_interval=600,
            auto_refresh=True,
            theme="dark",
            responsive=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        # 競爭分析儀表板
        competitor_widgets = [
            WidgetConfig(
                widget_id="market_share",
                widget_type="chart",
                title="市場份額分析",
                data_source="competitors",
                refresh_interval=3600,
                position={"x": 0, "y": 0, "width": 6, "height": 5},
                style={
                    "chart_type": "pie",
                    "show_percentages": True
                }
            ),
            WidgetConfig(
                widget_id="competitor_metrics",
                widget_type="table",
                title="競爭對手指標",
                data_source="competitors",
                refresh_interval=3600,
                position={"x": 6, "y": 0, "width": 6, "height": 5},
                style={
                    "sortable": True,
                    "highlight_best": True
                }
            ),
            WidgetConfig(
                widget_id="opportunity_keywords",
                widget_type="table",
                title="機會關鍵字",
                data_source="competitors",
                refresh_interval=3600,
                position={"x": 0, "y": 5, "width": 12, "height": 4},
                style={
                    "show_difficulty": True,
                    "color_code_difficulty": True
                }
            )
        ]
        
        dashboards['competitors'] = DashboardLayout(
            dashboard_id="competitors",
            title="競爭對手分析",
            description="監控競爭對手表現和市場機會",
            widgets=competitor_widgets,
            global_refresh_interval=3600,
            auto_refresh=True,
            theme="auto",
            responsive=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        return dashboards
    
    def save_dashboard_config(self, dashboard: DashboardLayout):
        """儲存儀表板配置"""
        config_file = self.config_dir / f"{dashboard.dashboard_id}.json"
        
        dashboard.updated_at = datetime.now()
        
        with open(config_file, 'w', encoding='utf-8') as f:
            json.dump(dashboard.to_dict(), f, indent=2, ensure_ascii=False, default=str)
        
        logger.info(f"儀表板配置已儲存: {config_file}")
    
    def load_dashboard_config(self, dashboard_id: str) -> Optional[DashboardLayout]:
        """載入儀表板配置"""
        config_file = self.config_dir / f"{dashboard_id}.json"
        
        if not config_file.exists():
            logger.warning(f"儀表板配置不存在: {dashboard_id}")
            return None
        
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # 重建 WidgetConfig 對象
            widgets = []
            for widget_data in data['widgets']:
                widget = WidgetConfig(**widget_data)
                widgets.append(widget)
            
            # 重建 DashboardLayout 對象
            data['widgets'] = widgets
            data['created_at'] = datetime.fromisoformat(data['created_at'])
            data['updated_at'] = datetime.fromisoformat(data['updated_at'])
            
            dashboard = DashboardLayout(**data)
            
            logger.info(f"儀表板配置已載入: {dashboard_id}")
            return dashboard
            
        except Exception as e:
            logger.error(f"載入儀表板配置失敗 {dashboard_id}: {str(e)}")
            return None
    
    def get_dashboard_data(self, dashboard_id: str) -> Dict[str, Any]:
        """獲取儀表板數據"""
        dashboard = self.load_dashboard_config(dashboard_id)
        if dashboard is None:
            # 使用預設配置
            if dashboard_id in self.default_dashboards:
                dashboard = self.default_dashboards[dashboard_id]
            else:
                logger.error(f"找不到儀表板: {dashboard_id}")
                return {}
        
        dashboard_data = {
            'config': dashboard.to_dict(),
            'data': {},
            'last_update': datetime.now().isoformat()
        }
        
        # 獲取所有小工具的數據
        for widget in dashboard.widgets:
            if widget.data_source in self.data_sources:
                try:
                    import asyncio
                    
                    # 創建新的事件循環或使用現有的
                    try:
                        loop = asyncio.get_event_loop()
                    except RuntimeError:
                        loop = asyncio.new_event_loop()
                        asyncio.set_event_loop(loop)
                    
                    # 獲取數據
                    data = loop.run_until_complete(
                        self.data_sources[widget.data_source].get_data(widget.filters)
                    )
                    
                    dashboard_data['data'][widget.widget_id] = data
                    
                except Exception as e:
                    logger.error(f"獲取小工具數據失敗 {widget.widget_id}: {str(e)}")
                    dashboard_data['data'][widget.widget_id] = {}
            else:
                logger.warning(f"未知的數據源: {widget.data_source}")
                dashboard_data['data'][widget.widget_id] = {}
        
        return dashboard_data
    
    def create_dashboard_html(self, dashboard_id: str) -> str:
        """創建儀表板 HTML"""
        dashboard_data = self.get_dashboard_data(dashboard_id)
        
        if not dashboard_data:
            return "<html><body><h1>儀表板未找到</h1></body></html>"
        
        config = dashboard_data['config']
        
        html_template = f"""
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{config['title']}</title>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <style>
        body {{
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: {('var(--bg-color)' if config.get('theme') == 'auto' else '#f8f9fa' if config.get('theme') == 'light' else '#1e1e1e')};
            color: {('var(--text-color)' if config.get('theme') == 'auto' else '#333' if config.get('theme') == 'light' else '#fff')};
        }}
        
        .dashboard-header {{
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        
        .dashboard-grid {{
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }}
        
        .widget {{
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }}
        
        .widget-title {{
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #2C3E50;
        }}
        
        .metric-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }}
        
        .metric-card {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }}
        
        .metric-value {{
            font-size: 32px;
            font-weight: bold;
            margin: 10px 0;
        }}
        
        .metric-label {{
            font-size: 14px;
            opacity: 0.9;
        }}
        
        .last-update {{
            text-align: center;
            margin-top: 20px;
            color: #7F8C8D;
            font-size: 12px;
        }}
        
        @media (max-width: 768px) {{
            .dashboard-grid {{
                grid-template-columns: 1fr;
            }}
            .widget {{
                margin-bottom: 20px;
            }}
        }}
    </style>
</head>
<body>
    <div class="dashboard-header">
        <h1>{config['title']}</h1>
        <p>{config['description']}</p>
    </div>
    
    <div class="dashboard-grid">
        {self._generate_widget_html(dashboard_data)}
    </div>
    
    <div class="last-update">
        最後更新: {dashboard_data['last_update']}
        {f"| 自動重新整理: {config['global_refresh_interval']}秒" if config.get('auto_refresh') else ""}
    </div>
    
    <script>
        // 自動重新整理
        {f"setTimeout(() => location.reload(), {config['global_refresh_interval'] * 1000});" if config.get('auto_refresh') else ""}
        
        // 響應式處理
        function resizeCharts() {{
            var charts = document.querySelectorAll('.plotly-chart');
            charts.forEach(chart => {{
                Plotly.Plots.resize(chart);
            }});
        }}
        
        window.addEventListener('resize', resizeCharts);
    </script>
</body>
</html>
        """
        
        return html_template
    
    def _generate_widget_html(self, dashboard_data: Dict[str, Any]) -> str:
        """生成小工具 HTML"""
        widgets_html = []
        config = dashboard_data['config']
        data = dashboard_data['data']
        
        for widget in config['widgets']:
            widget_data = data.get(widget['widget_id'], {})
            
            # 計算 grid 位置
            position = widget['position']
            grid_column = f"{position['x'] + 1} / {position['x'] + position['width'] + 1}"
            grid_row = f"{position['y'] + 1} / {position['y'] + position['height'] + 1}"
            
            widget_html = f"""
            <div class="widget" style="grid-column: {grid_column}; grid-row: {grid_row};">
                <div class="widget-title">{widget['title']}</div>
                <div class="widget-content">
                    {self._generate_widget_content(widget, widget_data)}
                </div>
            </div>
            """
            
            widgets_html.append(widget_html)
        
        return '\n'.join(widgets_html)
    
    def _generate_widget_content(self, widget: Dict[str, Any], data: Dict[str, Any]) -> str:
        """生成小工具內容"""
        widget_type = widget['widget_type']
        
        if widget_type == 'metric':
            return self._generate_metric_widget(data)
        elif widget_type == 'chart':
            return self._generate_chart_widget(widget, data)
        elif widget_type == 'table':
            return self._generate_table_widget(widget, data)
        elif widget_type == 'gauge':
            return self._generate_gauge_widget(widget, data)
        else:
            return f"<p>不支援的小工具類型: {widget_type}</p>"
    
    def _generate_metric_widget(self, data: Dict[str, Any]) -> str:
        """生成指標小工具"""
        metrics = data.get('metrics', {})
        
        metric_cards = []
        for metric_name, value in metrics.items():
            if isinstance(value, (int, float)):
                if 'ctr' in metric_name or 'rate' in metric_name:
                    display_value = f"{value:.2%}"
                elif 'position' in metric_name:
                    display_value = f"{value:.1f}"
                elif 'score' in metric_name:
                    display_value = f"{value}"
                else:
                    display_value = f"{value:,}"
                
                # 中文標籤映射
                label_mapping = {
                    'total_clicks': '總點擊數',
                    'total_impressions': '總展示次數',
                    'average_ctr': '平均點擊率',
                    'average_position': '平均排名',
                    'lighthouse_seo_score': 'SEO評分',
                    'lighthouse_performance_score': '效能評分'
                }
                
                label = label_mapping.get(metric_name, metric_name)
                
                metric_cards.append(f"""
                <div class="metric-card">
                    <div class="metric-label">{label}</div>
                    <div class="metric-value">{display_value}</div>
                </div>
                """)
        
        return f'<div class="metric-grid">{"".join(metric_cards)}</div>'
    
    def _generate_chart_widget(self, widget: Dict[str, Any], data: Dict[str, Any]) -> str:
        """生成圖表小工具"""
        chart_id = f"chart_{widget['widget_id']}"
        
        # 簡化的圖表生成
        if 'top_keywords' in data:
            keywords_data = data['top_keywords']
            keywords = [kw['keyword'] for kw in keywords_data]
            clicks = [kw['clicks'] for kw in keywords_data]
            
            chart_data = f"""
            var data = [{{
                x: {json.dumps(keywords)},
                y: {json.dumps(clicks)},
                type: 'bar',
                marker: {{color: '#2E86AB'}}
            }}];
            
            var layout = {{
                title: '關鍵字點擊數',
                xaxis: {{title: '關鍵字'}},
                yaxis: {{title: '點擊數'}},
                margin: {{t: 40, r: 20, b: 40, l: 40}}
            }};
            
            Plotly.newPlot('{chart_id}', data, layout, {{responsive: true}});
            """
        else:
            chart_data = f"document.getElementById('{chart_id}').innerHTML = '<p>暫無圖表數據</p>';"
        
        return f"""
        <div id="{chart_id}" class="plotly-chart" style="height: 300px;"></div>
        <script>{chart_data}</script>
        """
    
    def _generate_table_widget(self, widget: Dict[str, Any], data: Dict[str, Any]) -> str:
        """生成表格小工具"""
        if 'top_keywords' in data:
            keywords_data = data['top_keywords']
            
            table_rows = []
            for kw in keywords_data:
                table_rows.append(f"""
                <tr>
                    <td>{kw['keyword']}</td>
                    <td>{kw['position']}</td>
                    <td>{kw['clicks']}</td>
                    <td>{kw['impressions']}</td>
                </tr>
                """)
            
            return f"""
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">關鍵字</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">排名</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">點擊</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">展示</th>
                    </tr>
                </thead>
                <tbody>
                    {"".join(table_rows)}
                </tbody>
            </table>
            """
        
        return "<p>暫無表格數據</p>"
    
    def _generate_gauge_widget(self, widget: Dict[str, Any], data: Dict[str, Any]) -> str:
        """生成儀表板小工具"""
        gauge_id = f"gauge_{widget['widget_id']}"
        
        # 獲取分數值
        metrics = data.get('metrics', {})
        score = metrics.get('lighthouse_seo_score', 0)
        
        gauge_data = f"""
        var data = [{{
            domain: {{ x: [0, 1], y: [0, 1] }},
            value: {score},
            title: {{ text: "分數" }},
            type: "indicator",
            mode: "gauge+number+delta",
            delta: {{ reference: 95 }},
            gauge: {{
                axis: {{ range: [null, 100] }},
                bar: {{ color: "darkblue" }},
                steps: [
                    {{ range: [0, 50], color: "lightgray" }},
                    {{ range: [50, 85], color: "gray" }},
                    {{ range: [85, 100], color: "lightgreen" }}
                ],
                threshold: {{
                    line: {{ color: "red", width: 4 }},
                    thickness: 0.75,
                    value: 90
                }}
            }}
        }}];
        
        var layout = {{ 
            width: 300, 
            height: 250,
            font: {{ size: 12 }},
            margin: {{ t: 20, r: 20, b: 20, l: 20 }}
        }};
        
        Plotly.newPlot('{gauge_id}', data, layout, {{responsive: true}});
        """
        
        return f"""
        <div id="{gauge_id}" style="height: 250px;"></div>
        <script>{gauge_data}</script>
        """
    
    def initialize_default_dashboards(self):
        """初始化預設儀表板"""
        for dashboard_id, dashboard in self.default_dashboards.items():
            self.save_dashboard_config(dashboard)
        
        logger.info("預設儀表板已初始化")
    
    def export_dashboard_html(self, dashboard_id: str, output_path: str):
        """匯出儀表板為 HTML 檔案"""
        html_content = self.create_dashboard_html(dashboard_id)
        
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        logger.info(f"儀表板已匯出: {output_file}")


# 使用範例
def main():
    """主函數範例"""
    # 初始化儀表板管理器
    manager = DashboardManager()
    
    # 初始化預設儀表板
    manager.initialize_default_dashboards()
    
    # 匯出主儀表板
    manager.export_dashboard_html('main', 'output/main_dashboard.html')
    manager.export_dashboard_html('ai_seo', 'output/ai_seo_dashboard.html')
    manager.export_dashboard_html('competitors', 'output/competitors_dashboard.html')
    
    print("儀表板已生成完成！")


if __name__ == "__main__":
    main()
