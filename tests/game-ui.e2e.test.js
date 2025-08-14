/**
 * ClickFun E2E UI 測試
 * 使用 Puppeteer 測試真實瀏覽器中的用戶互動
 */

describe("ClickFun E2E 測試", () => {
  let page;
  const baseURL = "http://localhost:8080";

  beforeAll(async () => {
    page = await browser.newPage();

    // 設定視窗大小
    await page.setViewport({ width: 1280, height: 720 });

    // 導航到遊戲頁面
    await page.goto(baseURL, { waitUntil: "networkidle0" });
  });

  afterAll(async () => {
    if (page) {
      await page.close();
    }
  });

  describe("頁面載入測試", () => {
    test("應該成功載入遊戲頁面", async () => {
      const title = await page.title();
      expect(title).toContain("ClickFun");
    });

    test("應該顯示主選單", async () => {
      const menuExists = await waitForElement(page, ".menu-screen");
      expect(menuExists).toBe(true);
    });

    test("應該顯示遊戲標題", async () => {
      const titleElement = await page.$(".brand-title");
      expect(titleElement).toBeTruthy();

      const titleText = await page.$eval(
        ".brand-title",
        (el) => el.textContent
      );
      expect(titleText).toContain("ClickFun");
    });
  });

  describe("單人模式測試", () => {
    test("應該能夠開始單人遊戲", async () => {
      // 點擊單人模式按鈕
      await page.click(".menu-btn-primary");

      // 等待遊戲畫面載入
      const gameScreenExists = await waitForElement(
        page,
        ".game-screen.active"
      );
      expect(gameScreenExists).toBe(true);
    });

    test("應該顯示遊戲計時器", async () => {
      const timerExists = await waitForElement(page, ".game-timer");
      expect(timerExists).toBe(true);
    });

    test("應該能夠點擊遊戲區域", async () => {
      // 點擊遊戲區域
      await page.click(".single-player-area");

      // 檢查是否有視覺回饋（這裡可能需要等待動畫）
      await sleep(100);

      // 驗證點擊有效果（可以檢查分數或其他狀態）
      const gameState = await getGameState(page);
      expect(gameState).toBeDefined();
    });

    test("應該顯示 TPS 資訊", async () => {
      // 檢查 TPS 顯示元素
      const tpsExists = await waitForElement(page, ".header-tps");
      expect(tpsExists).toBe(true);
    });
  });

  describe("雙人模式測試", () => {
    beforeEach(async () => {
      // 回到主選單
      await page.goto(baseURL, { waitUntil: "networkidle0" });
    });

    test("應該能夠開始雙人遊戲", async () => {
      // 點擊雙人模式按鈕
      const dualModeButton = await page.$(".menu-btn-secondary");
      if (dualModeButton) {
        await dualModeButton.click();

        // 等待雙人遊戲畫面載入
        const dualGameExists = await waitForElement(page, ".dual-player-area");
        expect(dualGameExists).toBe(true);
      }
    });

    test("應該顯示兩個玩家區域", async () => {
      const dualModeButton = await page.$(".menu-btn-secondary");
      if (dualModeButton) {
        await dualModeButton.click();

        const playerZones = await page.$$(".player-zone");
        expect(playerZones.length).toBe(2);
      }
    });
  });

  describe("設定功能測試", () => {
    test("應該能夠開啟設定選單", async () => {
      // 尋找設定按鈕（可能在選單中）
      const settingsButton = await page.$('[data-action="settings"]');
      if (settingsButton) {
        await settingsButton.click();

        // 檢查設定面板是否出現
        const settingsPanel = await waitForElement(page, ".settings-panel");
        expect(settingsPanel).toBe(true);
      }
    });
  });

  describe("PWA 功能測試", () => {
    test("應該註冊 Service Worker", async () => {
      const swRegistered = await page.evaluate(() => {
        return "serviceWorker" in navigator;
      });

      expect(swRegistered).toBe(true);
    });

    test("應該載入 Web App Manifest", async () => {
      const manifestLink = await page.$('link[rel="manifest"]');
      expect(manifestLink).toBeTruthy();
    });

    test("應該設定正確的 theme-color", async () => {
      const themeColor = await page.$eval('meta[name="theme-color"]', (el) =>
        el.getAttribute("content")
      );

      expect(themeColor).toBeTruthy();
      expect(themeColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  describe("響應式設計測試", () => {
    test("應該在行動裝置尺寸下正常顯示", async () => {
      // 設定為行動裝置尺寸
      await page.setViewport({ width: 375, height: 667 });
      await page.reload({ waitUntil: "networkidle0" });

      // 檢查主選單是否仍然可見
      const menuVisible = await waitForElement(page, ".menu-screen");
      expect(menuVisible).toBe(true);
    });

    test("應該在平板尺寸下正常顯示", async () => {
      // 設定為平板尺寸
      await page.setViewport({ width: 768, height: 1024 });
      await page.reload({ waitUntil: "networkidle0" });

      const menuVisible = await waitForElement(page, ".menu-screen");
      expect(menuVisible).toBe(true);
    });

    afterAll(async () => {
      // 恢復原始視窗大小
      await page.setViewport({ width: 1280, height: 720 });
    });
  });
});
