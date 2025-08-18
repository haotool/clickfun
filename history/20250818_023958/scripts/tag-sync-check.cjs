#!/usr/bin/env node

/**
 * Git 標籤同步檢查與修復腳本
 * 基於 Context7 semantic-release 最佳實踐
 * 
 * @author s123104
 * @version 1.0.0
 * @created 2025-08-17T16:30:00+08:00
 */

const { execSync } = require('child_process');
const chalk = require('chalk');

class TagSyncManager {
  constructor() {
    this.localTags = new Set();
    this.remoteTags = new Set();
    this.conflicts = [];
    this.orphanedTags = [];
  }

  /**
   * 執行命令並返回結果
   */
  execCommand(command, silent = false) {
    try {
      const result = execSync(command, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' });
      return result.trim();
    } catch (error) {
      if (!silent) {
        console.error(chalk.red(`命令執行失敗: ${command}`));
        console.error(error.message);
      }
      return null;
    }
  }

  /**
   * 獲取本機標籤
   */
  getLocalTags() {
    console.log(chalk.blue('🔍 檢查本機標籤...'));
    const output = this.execCommand('git tag -l', true);
    if (output) {
      output.split('\n').forEach(tag => {
        if (tag.trim()) {
          this.localTags.add(tag.trim());
        }
      });
    }
    console.log(chalk.green(`✅ 找到 ${this.localTags.size} 個本機標籤`));
  }

  /**
   * 獲取遠端標籤
   */
  getRemoteTags() {
    console.log(chalk.blue('🔍 檢查遠端標籤...'));
    const output = this.execCommand('git ls-remote --tags origin', true);
    if (output) {
      output.split('\n').forEach(line => {
        const match = line.match(/refs\/tags\/(.+)$/);
        if (match && match[1]) {
          this.remoteTags.add(match[1]);
        }
      });
    }
    console.log(chalk.green(`✅ 找到 ${this.remoteTags.size} 個遠端標籤`));
  }

  /**
   * 檢查標籤衝突
   */
  async checkConflicts() {
    console.log(chalk.blue('\n🔍 檢查標籤衝突...'));
    
    for (const tag of this.localTags) {
      if (this.remoteTags.has(tag)) {
        // 檢查是否指向相同提交
        const localCommit = this.execCommand(`git rev-list -1 ${tag}`, true);
        const remoteCommit = this.execCommand(`git ls-remote origin refs/tags/${tag}`, true);
        
        if (localCommit && remoteCommit) {
          const remoteHash = remoteCommit.split('\t')[0];
          if (localCommit !== remoteHash) {
            this.conflicts.push({
              tag,
              localCommit,
              remoteCommit: remoteHash
            });
          }
        }
      }
    }

    // 檢查孤立標籤（本機有但遠端沒有的）
    for (const tag of this.localTags) {
      if (!this.remoteTags.has(tag)) {
        // 檢查該標籤指向的提交是否在當前分支歷史中
        const tagCommit = this.execCommand(`git rev-list -1 ${tag}`, true);
        const branchContains = this.execCommand(`git branch --contains ${tagCommit}`, true);
        
        if (!branchContains || branchContains.trim() === '') {
          this.orphanedTags.push(tag);
        }
      }
    }

    console.log(chalk.green(`✅ 檢查完成: ${this.conflicts.length} 個衝突, ${this.orphanedTags.length} 個孤立標籤`));
  }

  /**
   * 顯示檢查結果
   */
  displayResults() {
    console.log(chalk.yellow('\n📊 標籤同步檢查結果:'));
    console.log(`本機標籤: ${this.localTags.size}`);
    console.log(`遠端標籤: ${this.remoteTags.size}`);
    console.log(`衝突標籤: ${this.conflicts.length}`);
    console.log(`孤立標籤: ${this.orphanedTags.length}`);

    if (this.conflicts.length > 0) {
      console.log(chalk.red('\n⚠️  標籤衝突:'));
      this.conflicts.forEach(conflict => {
        console.log(`  ${conflict.tag}:`);
        console.log(`    本機: ${conflict.localCommit.substring(0, 7)}`);
        console.log(`    遠端: ${conflict.remoteCommit.substring(0, 7)}`);
      });
    }

    if (this.orphanedTags.length > 0) {
      console.log(chalk.yellow('\n🏷️  孤立標籤:'));
      this.orphanedTags.forEach(tag => {
        console.log(`  ${tag}`);
      });
    }
  }

  /**
   * 修復標籤問題
   */
  async fix() {
    if (this.orphanedTags.length === 0 && this.conflicts.length === 0) {
      console.log(chalk.green('\n✅ 標籤狀態正常，無需修復!'));
      return;
    }

    console.log(chalk.yellow('\n🔧 開始修復標籤問題...'));

    // 刪除孤立標籤
    for (const tag of this.orphanedTags) {
      console.log(chalk.yellow(`刪除孤立標籤: ${tag}`));
      this.execCommand(`git tag -d ${tag}`);
    }

    // 處理衝突標籤
    for (const conflict of this.conflicts) {
      console.log(chalk.yellow(`修復衝突標籤: ${conflict.tag}`));
      // 刪除本機標籤，從遠端重新獲取
      this.execCommand(`git tag -d ${conflict.tag}`);
      this.execCommand(`git fetch origin tag ${conflict.tag}`);
    }

    console.log(chalk.green('✅ 標籤修復完成!'));
  }

  /**
   * 完全同步標籤
   */
  async syncTags() {
    console.log(chalk.blue('\n🔄 同步遠端標籤...'));
    this.execCommand('git fetch --tags --prune');
    console.log(chalk.green('✅ 標籤同步完成!'));
  }

  /**
   * 主要執行流程
   */
  async run() {
    console.log(chalk.cyan('🏷️  Git 標籤同步檢查工具'));
    console.log(chalk.cyan('==========================\n'));

    this.getLocalTags();
    this.getRemoteTags();
    await this.checkConflicts();
    this.displayResults();
    
    const hasIssues = this.conflicts.length > 0 || this.orphanedTags.length > 0;
    
    if (hasIssues) {
      await this.fix();
    }
    
    await this.syncTags();
    
    console.log(chalk.green('\n🎉 標籤同步檢查完成!'));
  }
}

// 主程序
if (require.main === module) {
  const manager = new TagSyncManager();
  manager.run().catch(error => {
    console.error(chalk.red('❌ 執行失敗:'), error.message);
    process.exit(1);
  });
}

module.exports = TagSyncManager;
