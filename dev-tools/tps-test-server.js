/**
 * TPS 測試伺服器
 * 提供即時 TPS 測試和效能監控功能
 */

const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = 3001;

// 靜態檔案服務
app.use(express.static(path.join(__dirname, '..')));
app.use('/dev-tools', express.static(__dirname));

// TPS 測試頁面
app.get('/tps-test', (req, res) => {
  res.sendFile(path.join(__dirname, 'tps-test.html'));
});

// 啟動 HTTP 伺服器
const server = app.listen(PORT, () => {
  console.log(`🚀 TPS 測試伺服器啟動於 http://localhost:${PORT}`);
  console.log(`📊 TPS 測試頁面: http://localhost:${PORT}/tps-test`);
});

// WebSocket 伺服器用於即時數據傳輸
const wss = new WebSocket.Server({ server });

// 儲存連接的客戶端
const clients = new Set();

wss.on('connection', ws => {
  console.log('📱 新的 TPS 測試客戶端連接');
  clients.add(ws);

  ws.on('message', message => {
    try {
      const data = JSON.parse(message);

      // 處理不同類型的訊息
      switch (data.type) {
        case 'tps_data':
        // 廣播 TPS 數據給所有連接的客戶端
          broadcastToClients({
            type: 'tps_update',
            tps: data.tps,
            timestamp: Date.now(),
            clientId: data.clientId,
          });
          break;

        case 'performance_data':
        // 處理效能數據
          console.log(`📈 效能數據: FPS=${data.fps}, 記憶體=${data.memory}MB`);
          break;

        case 'test_result':
        // 處理測試結果
          console.log(`✅ 測試結果: ${data.testName} - ${data.result}`);
          break;
      }
    } catch (error) {
      console.error('❌ 訊息解析錯誤:', error);
    }
  });

  ws.on('close', () => {
    console.log('📱 TPS 測試客戶端斷線');
    clients.delete(ws);
  });

  // 發送歡迎訊息
  ws.send(
    JSON.stringify({
      type: 'welcome',
      message: 'TPS 測試伺服器連接成功',
      timestamp: Date.now(),
    }),
  );
});

// 廣播訊息給所有客戶端
function broadcastToClients(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// 定期發送伺服器狀態
setInterval(() => {
  broadcastToClients({
    type: 'server_status',
    connectedClients: clients.size,
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
}, 5000);

// 優雅關閉
process.on('SIGINT', () => {
  console.log('\n🛑 正在關閉 TPS 測試伺服器...');

  // 通知所有客戶端伺服器即將關閉
  broadcastToClients({
    type: 'server_shutdown',
    message: '伺服器即將關閉',
    timestamp: Date.now(),
  });

  // 關閉所有 WebSocket 連接
  clients.forEach(client => {
    client.close();
  });

  // 關閉伺服器
  server.close(() => {
    console.log('✅ TPS 測試伺服器已關閉');
    process.exit(0);
  });
});
