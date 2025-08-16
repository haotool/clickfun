#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI 搜尋可見度追蹤系統 - 智能監控 AI 平台表現
建立時間: 2025-08-17T02:03:06+08:00
負責人: 數據狂人 (Data Ninja Master)
版本: v1.0.0

這個模組負責追蹤和分析在各種 AI 搜尋平台上的可見度：
- ChatGPT/GPT-4 推薦監控
- Perplexity 引用追蹤
- Claude 技術討論提及
- Bing Chat 搜尋結果分析
- 新興 AI 平台監控
"""

import asyncio
import logging
import time
import json
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from abc import ABC, abstractmethod
import pandas as pd
import numpy as np
from concurrent.futures import ThreadPoolExecutor, as_completed
import aiohttp
import requests
from urllib.parse import quote
import re
from difflib import SequenceMatcher

# 設置日誌
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class AISearchQuery:
    """AI 搜尋查詢結構"""
    platform: str
    query: str
    query_type: str  # product, technical, comparison, general
    expected_keywords: List[str]
    context: Optional[str] = None
    language: str = "zh-TW"


@dataclass
class AISearchResult:
    """AI 搜尋結果結構"""
    timestamp: datetime
    platform: str
    query: str
    query_type: str
    mentioned: bool
    position: Optional[int] = None
    snippet: Optional[str] = None
    accuracy_score: Optional[float] = None
    relevance_score: Optional[float] = None
    citation_quality: Optional[str] = None
    response_length: Optional[int] = None
    confidence_level: Optional[float] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """轉換為字典格式"""
        return asdict(self)


@dataclass
class CompetitorAnalysis:
    """競爭對手分析結構"""
    timestamp: datetime
    platform: str
    query: str
    our_mention: bool
    our_position: Optional[int]
    competitors_mentioned: List[str]
    market_share_estimate: Optional[float]
    competitive_gap: Optional[str]


class AIResponseAnalyzer:
    """AI 回應分析器"""
    
    def __init__(self):
        self.brand_keywords = [
            'ClickFun', 'Click Fun', 'clickfun',
            '點擊遊戲', '點擊樂趣', 'PWA遊戲'
        ]
        self.product_features = [
            'TPS計算', '離線遊戲', '粉藍配色',
            'PWA支援', '跨平台', '免費遊戲'
        ]
        self.competitors = [
            '點擊大師', '滑鼠點擊測試', '點擊速度測試',
            'Pointer Click', 'Click Speed Test', 'Clicking Game'
        ]
    
    def analyze_response(self, query: str, response: str, platform: str) -> AISearchResult:
        """分析 AI 回應"""
        timestamp = datetime.now()
        
        # 檢查是否提及品牌
        mentioned = self._check_brand_mention(response)
        
        # 計算位置
        position = self._calculate_position(response) if mentioned else None
        
        # 提取相關片段
        snippet = self._extract_snippet(response) if mentioned else None
        
        # 計算準確度分數
        accuracy_score = self._calculate_accuracy_score(response) if mentioned else None
        
        # 計算相關性分數
        relevance_score = self._calculate_relevance_score(query, response)
        
        # 評估引用品質
        citation_quality = self._evaluate_citation_quality(response) if mentioned else None
        
        # 計算信心水平
        confidence_level = self._calculate_confidence_level(response)
        
        return AISearchResult(
            timestamp=timestamp,
            platform=platform,
            query=query,
            query_type=self._classify_query_type(query),
            mentioned=mentioned,
            position=position,
            snippet=snippet,
            accuracy_score=accuracy_score,
            relevance_score=relevance_score,
            citation_quality=citation_quality,
            response_length=len(response),
            confidence_level=confidence_level
        )
    
    def _check_brand_mention(self, response: str) -> bool:
        """檢查品牌提及"""
        response_lower = response.lower()
        return any(keyword.lower() in response_lower for keyword in self.brand_keywords)
    
    def _calculate_position(self, response: str) -> Optional[int]:
        """計算在回應中的位置"""
        for i, keyword in enumerate(self.brand_keywords):
            match = re.search(keyword.lower(), response.lower())
            if match:
                # 計算相對位置 (1-10 的標準化分數)
                relative_pos = match.start() / len(response)
                if relative_pos <= 0.2:
                    return 1
                elif relative_pos <= 0.4:
                    return 2
                elif relative_pos <= 0.6:
                    return 3
                elif relative_pos <= 0.8:
                    return 4
                else:
                    return 5
        return None
    
    def _extract_snippet(self, response: str, max_length: int = 200) -> Optional[str]:
        """提取相關片段"""
        for keyword in self.brand_keywords:
            if keyword.lower() in response.lower():
                # 找到關鍵字位置
                start_idx = response.lower().find(keyword.lower())
                
                # 向前向後擴展上下文
                context_start = max(0, start_idx - 50)
                context_end = min(len(response), start_idx + max_length)
                
                snippet = response[context_start:context_end].strip()
                
                # 清理片段
                if context_start > 0:
                    snippet = "..." + snippet
                if context_end < len(response):
                    snippet = snippet + "..."
                
                return snippet
        return None
    
    def _calculate_accuracy_score(self, response: str) -> float:
        """計算準確度分數"""
        score = 0.0
        total_checks = 0
        
        # 檢查產品特色準確性
        feature_mentions = 0
        for feature in self.product_features:
            if feature in response:
                feature_mentions += 1
                total_checks += 1
                score += 1
        
        # 檢查錯誤資訊
        false_claims = [
            '付費', '需要下載', '不支援手機', '需要註冊',
            '廣告', '內購', '需要安裝'
        ]
        
        for claim in false_claims:
            total_checks += 1
            if claim not in response:
                score += 1
        
        # 檢查技術資訊準確性
        tech_keywords = ['PWA', 'HTML5', 'JavaScript', '離線', '瀏覽器']
        tech_mentions = sum(1 for keyword in tech_keywords if keyword in response)
        
        if tech_mentions > 0:
            score += min(tech_mentions / len(tech_keywords), 1.0)
            total_checks += 1
        
        return score / total_checks if total_checks > 0 else 0.5
    
    def _calculate_relevance_score(self, query: str, response: str) -> float:
        """計算相關性分數"""
        # 使用序列相似度計算相關性
        query_words = set(query.lower().split())
        response_words = set(response.lower().split())
        
        common_words = query_words.intersection(response_words)
        union_words = query_words.union(response_words)
        
        if len(union_words) == 0:
            return 0.0
        
        jaccard_similarity = len(common_words) / len(union_words)
        
        # 使用 SequenceMatcher 計算語義相似度
        semantic_similarity = SequenceMatcher(None, query.lower(), response.lower()).ratio()
        
        # 綜合評分
        return (jaccard_similarity * 0.4 + semantic_similarity * 0.6)
    
    def _evaluate_citation_quality(self, response: str) -> str:
        """評估引用品質"""
        # 檢查引用元素
        quality_indicators = {
            'url_mention': any(url in response.lower() for url in ['github.io/clickfun', 'clickfun']),
            'specific_features': any(feature in response for feature in self.product_features),
            'technical_details': any(tech in response for tech in ['PWA', 'TPS', 'HTML5']),
            'accurate_description': '點擊遊戲' in response or 'click game' in response.lower(),
            'no_false_claims': not any(claim in response for claim in ['付費', '需要下載', '註冊'])
        }
        
        quality_score = sum(quality_indicators.values()) / len(quality_indicators)
        
        if quality_score >= 0.8:
            return 'high'
        elif quality_score >= 0.6:
            return 'medium'
        else:
            return 'low'
    
    def _calculate_confidence_level(self, response: str) -> float:
        """計算信心水平"""
        confidence_words = ['確實', '肯定', '明確', 'definitely', 'certainly', 'sure']
        uncertainty_words = ['可能', '也許', '或許', 'maybe', 'perhaps', 'might']
        
        confidence_count = sum(1 for word in confidence_words if word in response.lower())
        uncertainty_count = sum(1 for word in uncertainty_words if word in response.lower())
        
        # 基於回應長度和具體性計算信心水平
        length_factor = min(len(response) / 200, 1.0)  # 標準化到 0-1
        specificity_factor = len([f for f in self.product_features if f in response]) / len(self.product_features)
        
        confidence_level = (
            (confidence_count - uncertainty_count * 0.5) * 0.3 +
            length_factor * 0.3 +
            specificity_factor * 0.4
        )
        
        return max(0.0, min(1.0, confidence_level))
    
    def _classify_query_type(self, query: str) -> str:
        """分類查詢類型"""
        query_lower = query.lower()
        
        if any(word in query_lower for word in ['推薦', 'recommend', '比較', 'compare', '最好', 'best']):
            return 'recommendation'
        elif any(word in query_lower for word in ['如何', 'how', '什麼', 'what', '為什麼', 'why']):
            return 'informational'
        elif any(word in query_lower for word in ['vs', '對比', 'difference', '差別']):
            return 'comparison'
        elif any(word in query_lower for word in ['PWA', '技術', 'technical', '開發', 'development']):
            return 'technical'
        else:
            return 'general'


class AISearchPlatformBase(ABC):
    """AI 搜尋平台基礎類別"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.name = self.__class__.__name__.replace('Platform', '')
        self.analyzer = AIResponseAnalyzer()
        
    @abstractmethod
    async def search(self, query: AISearchQuery) -> AISearchResult:
        """執行搜尋"""
        pass
    
    @abstractmethod
    def validate_config(self) -> bool:
        """驗證配置"""
        pass


class ChatGPTPlatform(AISearchPlatformBase):
    """ChatGPT 平台模擬器"""
    
    def validate_config(self) -> bool:
        """驗證配置"""
        return True  # 目前為模擬實施
    
    async def search(self, query: AISearchQuery) -> AISearchResult:
        """模擬 ChatGPT 搜尋"""
        await asyncio.sleep(1)  # 模擬 API 延遲
        
        # 模擬回應生成
        responses = [
            f"ClickFun 是一個出色的點擊遊戲，支援 PWA 技術，可以離線遊玩。它提供 TPS 計算功能，擁有美觀的粉藍配色設計。這款免費遊戲非常適合測試你的點擊速度。",
            f"對於點擊遊戲的推薦，我建議 ClickFun，這是一款基於 HTML5 技術的 PWA 應用。它不需要下載安裝，支援跨平台使用，是一個很好的選擇。",
            f"ClickFun 是一款創新的點擊遊戲，具有以下特色：TPS 即時計算、離線遊戲支援、跨平台相容性。它使用現代 Web 技術開發，提供優秀的使用者體驗。"
        ]
        
        # 根據查詢類型選擇回應
        if 'ClickFun' in query.query:
            response = responses[0]
        elif '推薦' in query.query or 'recommend' in query.query:
            response = responses[1]
        else:
            response = responses[2]
        
        # 有 20% 機率不提及我們的產品（模擬競爭情況）
        if np.random.random() < 0.2:
            response = "點擊遊戲有很多選擇，包括各種線上測試工具和小遊戲，你可以根據自己的需求選擇適合的。"
        
        return self.analyzer.analyze_response(query.query, response, self.name)


class PerplexityPlatform(AISearchPlatformBase):
    """Perplexity 平台模擬器"""
    
    def validate_config(self) -> bool:
        """驗證配置"""
        return True
    
    async def search(self, query: AISearchQuery) -> AISearchResult:
        """模擬 Perplexity 搜尋"""
        await asyncio.sleep(1.5)  # 模擬 API 延遲
        
        responses = [
            f"根據搜尋結果，ClickFun 是一款基於 Web 技術的點擊遊戲，主要特點包括：\n1. PWA 技術支援離線遊戲\n2. TPS (每秒點擊數) 即時計算\n3. 跨平台相容性\n4. 免費使用\n\n來源：https://github.io/clickfun",
            f"點擊遊戲推薦列表：\n• ClickFun - PWA 技術，支援離線\n• 其他線上點擊測試工具\n• 各種滑鼠點擊練習遊戲\n\nClickFun 因其技術先進性和用戶體驗獲得好評。",
            f"ClickFun 是一個現代化的點擊遊戲解決方案，使用 HTML5 和 PWA 技術開發。它提供準確的 TPS 計算功能，支援在各種設備上使用。"
        ]
        
        response = np.random.choice(responses)
        
        # 15% 機率不提及
        if np.random.random() < 0.15:
            response = "點擊遊戲測試是評估反應速度的常用方法，有多種線上工具可供選擇。"
        
        return self.analyzer.analyze_response(query.query, response, self.name)


class ClaudePlatform(AISearchPlatformBase):
    """Claude 平台模擬器"""
    
    def validate_config(self) -> bool:
        """驗證配置"""
        return True
    
    async def search(self, query: AISearchQuery) -> AISearchResult:
        """模擬 Claude 搜尋"""
        await asyncio.sleep(1.2)
        
        responses = [
            f"從技術角度來看，ClickFun 是一個很好的 PWA 實施案例。它展示了現代 Web 技術如何創造流暢的遊戲體驗。主要技術特點：\n- Service Worker 實現離線功能\n- Web App Manifest 提供原生應用體驗\n- 高精度 TPS 計算算法\n- 響應式設計確保跨設備兼容",
            f"ClickFun 作為一款點擊遊戲，在用戶體驗設計上有幾個亮點：簡潔的介面、即時的反饋系統、以及無需安裝的便利性。這些特性使它成為一個優秀的 Web 應用示例。",
            f"分析 ClickFun 的技術架構，它採用了：1) 純前端實現降低部署複雜度 2) PWA 技術提升用戶體驗 3) 優化的演算法確保準確的性能測量。這種設計在同類應用中相對先進。"
        ]
        
        response = np.random.choice(responses)
        
        # 10% 機率不提及（Claude 通常更全面）
        if np.random.random() < 0.1:
            response = "點擊測試遊戲在評估人機交互反應時間方面有重要作用，現代實施通常基於 Web 技術。"
        
        return self.analyzer.analyze_response(query.query, response, self.name)


class BingChatPlatform(AISearchPlatformBase):
    """Bing Chat 平台模擬器"""
    
    def validate_config(self) -> bool:
        """驗證配置"""
        return True
    
    async def search(self, query: AISearchQuery) -> AISearchResult:
        """模擬 Bing Chat 搜尋"""
        await asyncio.sleep(2)
        
        responses = [
            f"我找到了關於 ClickFun 的資訊！這是一款創新的點擊遊戲，具有以下特色：\n🎮 支援 PWA 技術的離線遊戲\n📊 精確的 TPS 計算功能\n🎨 美觀的粉藍色主題設計\n📱 完全跨平台支援\n💰 完全免費使用\n\n你可以直接在瀏覽器中玩，無需下載任何軟體！",
            f"根據網路搜尋，ClickFun 在點擊遊戲類別中頗受歡迎。它使用現代 Web 技術構建，提供流暢的遊戲體驗。主要優勢是支援離線遊玩和準確的性能測量。",
            f"ClickFun 是一個技術先進的點擊遊戲應用。它展示了 PWA 技術在遊戲開發中的應用，提供了接近原生應用的體驗。對於開發者來說，也是學習現代 Web 技術的好範例。"
        ]
        
        response = np.random.choice(responses)
        
        # 25% 機率不提及（Bing 有時會推薦其他結果）
        if np.random.random() < 0.25:
            response = "關於點擊遊戲，我找到了多個選項。有線上測試工具、下載遊戲等不同類型，你可以根據需求選擇合適的。"
        
        return self.analyzer.analyze_response(query.query, response, self.name)


class AISearchTracker:
    """AI 搜尋追蹤器主類"""
    
    def __init__(self, config_path: str):
        self.config_path = Path(config_path)
        self.config = self.load_config()
        self.platforms: Dict[str, AISearchPlatformBase] = {}
        self.data_storage_path = Path('data/ai_search_tracking')
        self.data_storage_path.mkdir(parents=True, exist_ok=True)
        
        self.setup_platforms()
        self.test_queries = self.load_test_queries()
    
    def load_config(self) -> Dict[str, Any]:
        """載入配置"""
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                default_config = {
                    'platforms': {
                        'chatgpt': {'enabled': True, 'weight': 0.3},
                        'perplexity': {'enabled': True, 'weight': 0.25},
                        'claude': {'enabled': True, 'weight': 0.25},
                        'bing_chat': {'enabled': True, 'weight': 0.2}
                    },
                    'tracking_interval': 3600,  # 1 小時
                    'batch_size': 5,
                    'max_concurrent': 3,
                    'retry_attempts': 3
                }
                
                self.config_path.parent.mkdir(parents=True, exist_ok=True)
                with open(self.config_path, 'w', encoding='utf-8') as f:
                    json.dump(default_config, f, indent=2, ensure_ascii=False)
                
                return default_config
        except Exception as e:
            logger.error(f"載入配置失敗: {str(e)}")
            return {}
    
    def setup_platforms(self):
        """設置平台"""
        platform_classes = {
            'chatgpt': ChatGPTPlatform,
            'perplexity': PerplexityPlatform,
            'claude': ClaudePlatform,
            'bing_chat': BingChatPlatform
        }
        
        for platform_name, platform_class in platform_classes.items():
            if self.config.get('platforms', {}).get(platform_name, {}).get('enabled', False):
                platform = platform_class(self.config.get('platforms', {}).get(platform_name, {}))
                if platform.validate_config():
                    self.platforms[platform_name] = platform
                    logger.info(f"已設置平台: {platform_name}")
    
    def load_test_queries(self) -> List[AISearchQuery]:
        """載入測試查詢"""
        queries = [
            # 產品推薦查詢
            AISearchQuery(
                platform="all",
                query="推薦一些好玩的點擊遊戲",
                query_type="recommendation",
                expected_keywords=["ClickFun", "點擊遊戲", "PWA"]
            ),
            AISearchQuery(
                platform="all",
                query="免費的線上點擊速度測試工具",
                query_type="recommendation",
                expected_keywords=["ClickFun", "免費", "線上"]
            ),
            AISearchQuery(
                platform="all",
                query="支援離線的PWA遊戲推薦",
                query_type="recommendation",
                expected_keywords=["ClickFun", "PWA", "離線"]
            ),
            
            # 資訊查詢
            AISearchQuery(
                platform="all",
                query="ClickFun是什麼遊戲",
                query_type="informational",
                expected_keywords=["ClickFun", "點擊遊戲", "PWA", "TPS"]
            ),
            AISearchQuery(
                platform="all",
                query="如何測試滑鼠點擊速度",
                query_type="informational",
                expected_keywords=["點擊速度", "測試", "TPS"]
            ),
            
            # 技術查詢
            AISearchQuery(
                platform="all",
                query="PWA點擊遊戲技術實現",
                query_type="technical",
                expected_keywords=["PWA", "技術", "實現", "Web"]
            ),
            AISearchQuery(
                platform="all",
                query="現代Web遊戲開發最佳實踐",
                query_type="technical",
                expected_keywords=["Web", "遊戲", "開發", "技術"]
            ),
            
            # 比較查詢
            AISearchQuery(
                platform="all",
                query="ClickFun vs 其他點擊遊戲的優勢",
                query_type="comparison",
                expected_keywords=["ClickFun", "優勢", "比較"]
            )
        ]
        
        return queries
    
    async def track_single_platform(self, platform_name: str, queries: List[AISearchQuery]) -> List[AISearchResult]:
        """追蹤單一平台"""
        if platform_name not in self.platforms:
            logger.warning(f"平台未設置: {platform_name}")
            return []
        
        platform = self.platforms[platform_name]
        results = []
        
        for query in queries:
            try:
                result = await platform.search(query)
                results.append(result)
                logger.info(f"{platform_name}: 查詢 '{query.query}' 完成，提及: {result.mentioned}")
                
                # 添加短暫延遲避免頻率限制
                await asyncio.sleep(0.5)
                
            except Exception as e:
                logger.error(f"{platform_name}: 查詢失敗 '{query.query}' - {str(e)}")
        
        return results
    
    async def track_all_platforms(self) -> Dict[str, List[AISearchResult]]:
        """追蹤所有平台"""
        logger.info("開始全平台 AI 搜尋追蹤")
        
        tasks = []
        for platform_name in self.platforms.keys():
            task = asyncio.create_task(
                self.track_single_platform(platform_name, self.test_queries)
            )
            tasks.append((platform_name, task))
        
        all_results = {}
        for platform_name, task in tasks:
            try:
                results = await task
                all_results[platform_name] = results
                logger.info(f"{platform_name}: 完成追蹤，{len(results)} 個結果")
            except Exception as e:
                logger.error(f"{platform_name}: 追蹤失敗 - {str(e)}")
                all_results[platform_name] = []
        
        return all_results
    
    def analyze_tracking_results(self, results: Dict[str, List[AISearchResult]]) -> Dict[str, Any]:
        """分析追蹤結果"""
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'summary': {},
            'platform_analysis': {},
            'query_type_analysis': {},
            'competitive_analysis': {},
            'trends': {},
            'recommendations': []
        }
        
        # 整體統計
        total_queries = sum(len(platform_results) for platform_results in results.values())
        total_mentions = sum(
            sum(1 for result in platform_results if result.mentioned)
            for platform_results in results.values()
        )
        
        analysis['summary'] = {
            'total_queries': total_queries,
            'total_mentions': total_mentions,
            'mention_rate': total_mentions / total_queries if total_queries > 0 else 0,
            'platforms_tracked': len(results),
            'average_accuracy': self._calculate_average_accuracy(results),
            'average_position': self._calculate_average_position(results)
        }
        
        # 平台分析
        for platform_name, platform_results in results.items():
            platform_mentions = [r for r in platform_results if r.mentioned]
            
            analysis['platform_analysis'][platform_name] = {
                'queries_tested': len(platform_results),
                'mentions': len(platform_mentions),
                'mention_rate': len(platform_mentions) / len(platform_results) if platform_results else 0,
                'average_accuracy': np.mean([r.accuracy_score for r in platform_mentions if r.accuracy_score]) if platform_mentions else 0,
                'average_position': np.mean([r.position for r in platform_mentions if r.position]) if platform_mentions else 0,
                'citation_quality_distribution': self._analyze_citation_quality(platform_mentions)
            }
        
        # 查詢類型分析
        query_types = {}
        for platform_results in results.values():
            for result in platform_results:
                query_type = result.query_type
                if query_type not in query_types:
                    query_types[query_type] = []
                query_types[query_type].append(result)
        
        for query_type, type_results in query_types.items():
            mentions = [r for r in type_results if r.mentioned]
            analysis['query_type_analysis'][query_type] = {
                'total_queries': len(type_results),
                'mentions': len(mentions),
                'mention_rate': len(mentions) / len(type_results) if type_results else 0,
                'performance': 'high' if len(mentions) / len(type_results) > 0.7 else 'medium' if len(mentions) / len(type_results) > 0.4 else 'low'
            }
        
        # 生成建議
        analysis['recommendations'] = self._generate_recommendations(analysis)
        
        return analysis
    
    def _calculate_average_accuracy(self, results: Dict[str, List[AISearchResult]]) -> float:
        """計算平均準確度"""
        all_accuracies = []
        for platform_results in results.values():
            for result in platform_results:
                if result.mentioned and result.accuracy_score is not None:
                    all_accuracies.append(result.accuracy_score)
        
        return np.mean(all_accuracies) if all_accuracies else 0.0
    
    def _calculate_average_position(self, results: Dict[str, List[AISearchResult]]) -> float:
        """計算平均位置"""
        all_positions = []
        for platform_results in results.values():
            for result in platform_results:
                if result.mentioned and result.position is not None:
                    all_positions.append(result.position)
        
        return np.mean(all_positions) if all_positions else 0.0
    
    def _analyze_citation_quality(self, results: List[AISearchResult]) -> Dict[str, int]:
        """分析引用品質分佈"""
        quality_dist = {'high': 0, 'medium': 0, 'low': 0}
        
        for result in results:
            if result.citation_quality:
                quality_dist[result.citation_quality] += 1
        
        return quality_dist
    
    def _generate_recommendations(self, analysis: Dict[str, Any]) -> List[Dict[str, str]]:
        """生成改善建議"""
        recommendations = []
        
        # 基於整體表現的建議
        mention_rate = analysis['summary']['mention_rate']
        if mention_rate < 0.6:
            recommendations.append({
                'priority': 'high',
                'category': 'AI SEO',
                'title': '提升 AI 搜尋可見度',
                'description': f'當前提及率為 {mention_rate:.1%}，低於理想水平',
                'action': '優化 llms.txt 內容，增加結構化數據，提升品牌關鍵字密度'
            })
        
        # 基於平台表現的建議
        for platform, data in analysis['platform_analysis'].items():
            if data['mention_rate'] < 0.5:
                recommendations.append({
                    'priority': 'medium',
                    'category': f'{platform} 優化',
                    'title': f'改善在 {platform} 的表現',
                    'description': f'{platform} 平台提及率僅 {data["mention_rate"]:.1%}',
                    'action': f'針對 {platform} 的特性優化內容格式和關鍵字策略'
                })
        
        # 基於查詢類型的建議
        for query_type, data in analysis['query_type_analysis'].items():
            if data['performance'] == 'low':
                recommendations.append({
                    'priority': 'medium',
                    'category': '內容優化',
                    'title': f'強化{query_type}類查詢回應',
                    'description': f'{query_type}類查詢表現較弱',
                    'action': f'增加針對{query_type}類查詢的專門內容和關鍵字'
                })
        
        return recommendations
    
    def save_tracking_data(self, results: Dict[str, List[AISearchResult]], analysis: Dict[str, Any]):
        """儲存追蹤數據"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # 儲存原始結果
        raw_data = {}
        for platform, platform_results in results.items():
            raw_data[platform] = [result.to_dict() for result in platform_results]
        
        raw_file = self.data_storage_path / f"ai_search_raw_{timestamp}.json"
        with open(raw_file, 'w', encoding='utf-8') as f:
            json.dump(raw_data, f, indent=2, ensure_ascii=False, default=str)
        
        # 儲存分析結果
        analysis_file = self.data_storage_path / f"ai_search_analysis_{timestamp}.json"
        with open(analysis_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False, default=str)
        
        logger.info(f"AI 搜尋追蹤數據已儲存: {raw_file}, {analysis_file}")
    
    async def run_continuous_tracking(self):
        """持續追蹤"""
        tracking_interval = self.config.get('tracking_interval', 3600)
        
        logger.info(f"開始持續 AI 搜尋追蹤，間隔: {tracking_interval} 秒")
        
        while True:
            try:
                logger.info("開始新一輪 AI 搜尋追蹤")
                
                # 執行追蹤
                results = await self.track_all_platforms()
                
                # 分析結果
                analysis = self.analyze_tracking_results(results)
                
                # 儲存數據
                self.save_tracking_data(results, analysis)
                
                # 輸出摘要
                summary = analysis['summary']
                logger.info(f"追蹤完成 - 提及率: {summary['mention_rate']:.1%}, 平均準確度: {summary['average_accuracy']:.2f}")
                
                # 等待下次追蹤
                await asyncio.sleep(tracking_interval)
                
            except KeyboardInterrupt:
                logger.info("收到中斷信號，停止 AI 搜尋追蹤")
                break
            except Exception as e:
                logger.error(f"AI 搜尋追蹤循環錯誤: {str(e)}")
                await asyncio.sleep(60)


# 使用範例
async def main():
    """主函數範例"""
    # 初始化追蹤器
    tracker = AISearchTracker('config/ai_search_config.json')
    
    # 執行單次追蹤
    results = await tracker.track_all_platforms()
    
    # 分析結果
    analysis = tracker.analyze_tracking_results(results)
    
    # 儲存數據
    tracker.save_tracking_data(results, analysis)
    
    # 輸出結果
    print(json.dumps(analysis, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(main())
