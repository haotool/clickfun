# 📚 ClickFun API 文檔

> **版本**: 7.2.3  
> **最後更新**: 2025-08-18T02:39:58+08:00  
> **作者**: haotool (haotool.org@gmail.com)

## 📋 目錄

- [核心 API](#核心-api)
- [遊戲引擎 API](#遊戲引擎-api)
- [儲存 API](#儲存-api)
- [PWA API](#pwa-api)
- [效果 API](#效果-api)
- [工具函數](#工具函數)

## 核心 API

### 🎮 GameEngine

主要遊戲引擎類別，管理遊戲狀態和邏輯。

```javascript
class AdvancedGameEngine {
  constructor()
  
  // 遊戲控制
  startGame(mode: string, duration: number): void
  pauseGame(): void
  resumeGame(): void
  endGame(): GameResult
  
  // 狀態管理
  getState(): GameState
  setState(state: GameState): void
  
  // 事件處理
  handleClick(event: ClickEvent): void
  handleMultiTouch(events: TouchEvent[]): void
  
  // 統計
  getTPS(): number
  getScore(): number
  getGameHistory(): GameSession[]
}
```

**使用範例**:
```javascript
const gameEngine = new AdvancedGameEngine();

// 開始 30 秒單人遊戲
gameEngine.startGame('single', 30000);

// 處理點擊事件
gameEngine.handleClick({
  x: 100,
  y: 200,
  timestamp: performance.now(),
  playerId: 1
});

// 獲取當前 TPS
const currentTPS = gameEngine.getTPS();
```

### 🖱️ InputManager

輸入事件管理器，處理多點觸控和滑鼠事件。

```javascript
class AdvancedInputManager {
  constructor(gameEngine: GameEngine)
  
  // 事件綁定
  setupEventListeners(): void
  removeEventListeners(): void
  
  // 觸控處理
  handleTouchStart(event: TouchEvent): void
  handleTouchEnd(event: TouchEvent): void
  handleTouchMove(event: TouchEvent): void
  
  // 滑鼠處理
  handleMouseDown(event: MouseEvent): void
  handleMouseUp(event: MouseEvent): void
  
  // 設定
  setDebounceDelay(ms: number): void
  enableHapticFeedback(enabled: boolean): void
}
```

**觸控事件結構**:
```javascript
interface ClickEvent {
  x: number;           // X 座標
  y: number;           // Y 座標
  timestamp: number;   // 時間戳記
  playerId: number;    // 玩家 ID (1 或 2)
  type: 'touch' | 'mouse';
}
```

### 🔊 AudioManager

音效管理器，使用 Web Audio API 提供高效能音效。

```javascript
class AdvancedAudioManager {
  constructor()
  
  // 初始化
  init(): Promise<void>
  
  // 音效播放
  playClickSound(volume?: number): void
  playSuccessSound(): void
  playCountdownSound(): void
  
  // 音量控制
  setMasterVolume(level: number): void
  getMasterVolume(): number
  
  // 設定
  setEnabled(enabled: boolean): void
  isEnabled(): boolean
  
  // 進階功能
  createAudioBuffer(audioData: ArrayBuffer): AudioBuffer
  scheduleSound(buffer: AudioBuffer, when: number): void
}
```

## 遊戲引擎 API

### 📊 TPS Calculator

每秒點擊次數計算器。

```javascript
class TPSCalculator {
  constructor(windowSize: number = 1000)
  
  // 點擊記錄
  addClick(timestamp: number): void
  
  // 計算 TPS
  calculateTPS(): number
  getCurrentTPS(): number
  getAverageTPS(): number
  getPeakTPS(): number
  
  // 統計資料
  getClickHistory(): number[]
  getStatistics(): TPSStats
  
  // 設定
  setWindowSize(ms: number): void
  reset(): void
}
```

**TPS 統計結構**:
```javascript
interface TPSStats {
  current: number;     // 當前 TPS
  average: number;     // 平均 TPS
  peak: number;        // 峰值 TPS
  total: number;       // 總點擊數
  duration: number;    // 遊戲時長 (ms)
  variance: number;    // 變異數
}
```

### 🎯 Game State

遊戲狀態管理。

```javascript
interface GameState {
  mode: 'idle' | 'playing' | 'paused' | 'ended';
  gameType: 'single' | 'dual';
  duration: number;
  remainingTime: number;
  players: PlayerState[];
  settings: GameSettings;
}

interface PlayerState {
  id: number;
  score: number;
  tps: number;
  active: boolean;
  color: string;
}

interface GameSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  effectsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
}
```

## 儲存 API

### 💾 StorageAdapter

統一儲存適配器，支援 IndexedDB 和 LocalStorage。

```javascript
class StorageAdapter {
  constructor(options: StorageOptions)
  
  // 基本操作
  async setItem(key: string, value: any, options?: SetOptions): Promise<void>
  async getItem(key: string): Promise<any>
  async removeItem(key: string): Promise<void>
  async clear(): Promise<void>
  
  // 進階操作
  async keys(): Promise<string[]>
  async size(): Promise<number>
  async getStats(): Promise<StorageStats>
  
  // 配額管理
  async checkStorageQuota(): Promise<QuotaInfo>
  async cleanupExpiredData(): Promise<number>
}
```

**配置選項**:
```javascript
interface StorageOptions {
  preferredStorage: 'indexeddb' | 'localstorage';
  dbName: string;
  version: number;
  quotaWarningThreshold: number;
  debug: boolean;
}

interface SetOptions {
  ttl?: number;  // 存活時間 (毫秒)
}
```

### 🎮 GameStorage

遊戲專用高階儲存 API。

```javascript
class GameStorage {
  constructor(storageAdapter: StorageAdapter)
  
  // 設定管理
  async saveSettings(settings: GameSettings): Promise<void>
  async getSettings(): Promise<GameSettings>
  
  // 分數記錄
  async saveHighScore(mode: string, score: number, tps: number): Promise<void>
  async getHighScore(mode: string): Promise<HighScoreRecord>
  async getLeaderboard(mode: string, limit: number): Promise<HighScoreRecord[]>
  
  // 遊戲歷史
  async saveGameHistory(gameData: GameSession): Promise<void>
  async getGameHistory(limit?: number): Promise<GameSession[]>
  async getGameStats(): Promise<GameStats>
  
  // 資料管理
  async clearGameData(): Promise<void>
  async exportData(): Promise<string>
  async importData(data: string): Promise<void>
}
```

**資料結構**:
```javascript
interface HighScoreRecord {
  score: number;
  tps: number;
  timestamp: number;
  date: string;
  mode: string;
}

interface GameSession {
  id: number;
  mode: string;
  duration: number;
  score: number;
  peakTPS: number;
  averageTPS: number;
  timestamp: number;
  playerCount: number;
}
```

## PWA API

### 📱 PWAUpdateManager

PWA 更新管理器。

```javascript
class PWAUpdateManager {
  constructor()
  
  // Service Worker 註冊
  async registerServiceWorker(): Promise<void>
  
  // 更新管理
  showUpdatePrompt(): void
  showOfflinePrompt(): void
  hidePrompt(): void
  
  // 事件處理
  onNeedRefresh(callback: () => void): void
  onOfflineReady(callback: () => void): void
  onRegistered(callback: (registration: ServiceWorkerRegistration) => void): void
  
  // 手動更新
  checkForUpdates(): Promise<boolean>
  applyUpdate(): Promise<void>
}
```

### 🛡️ ServiceWorker Events

Service Worker 事件接口。

```javascript
interface PWAEvents {
  onNeedRefresh: () => void;
  onOfflineReady: () => void;
  onRegistered: (registration: ServiceWorkerRegistration) => void;
  onRegisterError: (error: Error) => void;
}

// 使用方式
const updateManager = new PWAUpdateManager();
updateManager.onNeedRefresh(() => {
  console.log('新版本可用');
});
```

## 效果 API

### ✨ EffectsWorker

視覺效果工作執行緒 API。

```javascript
// 主執行緒向 Worker 發送訊息
interface WorkerMessage {
  type: 'tap' | 'config' | 'resize';
  data: any;
}

// Tap 事件資料
interface TapData {
  pointers: Array<{
    x: number;
    y: number;
    playerId: number;
  }>;
  settings: {
    rippleEnabled: boolean;
    lightningEnabled: boolean;
    tier: number;
  };
}

// Worker 回應
interface WorkerResponse {
  type: 'ready' | 'error' | 'performance';
  data: any;
}
```

**使用範例**:
```javascript
// 發送觸控事件到 Worker
worker.postMessage({
  type: 'tap',
  data: {
    pointers: [{ x: 100, y: 200, playerId: 1 }],
    settings: {
      rippleEnabled: true,
      lightningEnabled: true,
      tier: 3
    }
  }
});

// 接收 Worker 回應
worker.onmessage = (event) => {
  const { type, data } = event.data;
  if (type === 'performance') {
    console.log('渲染效能:', data);
  }
};
```

### 🎨 Visual Effects

視覺效果配置。

```javascript
interface EffectConfig {
  tier: number;           // 效果等級 (1-6)
  color: string;          // 主色調
  widthMul: number;       // 寬度倍數
  jitterMul: number;      // 抖動倍數
  glow: number;           // 發光強度
  halo: number;           // 光暈大小
  particles: number;      // 粒子數量
  branch: number;         // 分支數量
  rings: number;          // 圓環數量
}

// 效果等級配置
const EFFECT_TIERS = {
  1: { color: '#ffe6f3', particles: 2, branch: 0 },
  2: { color: '#ffd9ef', particles: 3, branch: 0 },
  3: { color: '#ffb2dc', particles: 5, branch: 1 },
  4: { color: '#ff94d0', particles: 8, branch: 2 },
  5: { color: '#f66fb9', particles: 12, branch: 3 },
  6: { color: '#e054a3', particles: 18, branch: 4 }
};
```

## 工具函數

### 🛠️ Utility Functions

```javascript
// 效能工具
class PerformanceUtils {
  static measureTime(fn: () => void): number
  static throttle(fn: Function, delay: number): Function
  static debounce(fn: Function, delay: number): Function
  static requestIdleCallback(fn: Function): void
}

// 數學工具
class MathUtils {
  static lerp(a: number, b: number, t: number): number
  static clamp(value: number, min: number, max: number): number
  static distance(x1: number, y1: number, x2: number, y2: number): number
  static randomBetween(min: number, max: number): number
}

// 儲存工具
class StorageUtils {
  static formatBytes(bytes: number): string
  static compress(data: any): string
  static decompress(data: string): any
  static validateData(data: any, schema: object): boolean
}

// 裝置檢測
class DeviceUtils {
  static isMobile(): boolean
  static isTouch(): boolean
  static getDevicePixelRatio(): number
  static getViewportSize(): { width: number, height: number }
  static supportsWebGL(): boolean
  static supportsOffscreenCanvas(): boolean
}
```

### 🔧 Configuration

全域配置常數。

```javascript
const CONFIG = {
  // 遊戲設定
  GAME: {
    DEFAULT_DURATION: 30000,        // 預設遊戲時間 (30秒)
    MAX_TPS_DISPLAY: 999,           // 最大顯示 TPS
    TPS_UPDATE_INTERVAL: 100,       // TPS 更新間隔 (100ms)
    CLICK_DEBOUNCE: 16,             // 點擊防抖動 (16ms)
  },
  
  // 效果設定
  EFFECTS: {
    MAX_PARTICLES: 100,             // 最大粒子數
    LIGHTNING_DURATION: 150,        // 雷電持續時間 (ms)
    RIPPLE_DURATION: 800,           // 水波紋持續時間 (ms)
    CLEANUP_INTERVAL: 1000,         // 清理間隔 (1s)
  },
  
  // 儲存設定
  STORAGE: {
    MAX_HISTORY_RECORDS: 100,       // 最大歷史記錄數
    QUOTA_WARNING_THRESHOLD: 5242880, // 5MB 警告閾值
    CLEANUP_PERCENTAGE: 0.25,       // 清理 25% 舊資料
  },
  
  // 效能設定
  PERFORMANCE: {
    TARGET_FPS: 60,                 // 目標幀率
    LOW_POWER_THRESHOLD: 0.8,       // 低功耗閾值
    MEMORY_WARNING_THRESHOLD: 100,  // 記憶體警告 (MB)
  }
};
```

---

## 🔗 相關文檔

- [🏗️ 系統架構](./ARCHITECTURE.md)
- [📝 開發指南](./DEVELOPMENT.md)
- [🧪 測試說明](./TESTING.md)

---

**最後更新**: 2025-08-18T02:39:58+08:00  
**版本**: 7.2.3
