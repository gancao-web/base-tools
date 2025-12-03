/**
 * 本地记录管理类, 常用于搜索记录的本地化管理
 * @example
const historyStorage = new HistoryStorage('xxx-search-history'); // 创建管理对象

const historyList = ref(historyStorage.get()); // 获取搜索记录列表

function onSearch(word: string) {
  if (!word) return;
  historyStorage.add(word); // 添加搜索记录到本地 (最新的在前)
  href('xxx?word=' + word)
}

function clearHistory() {
  uni.showModal({
    content: '确定清空搜索历史记录？',
    success: (res) => {
      if (res.confirm) {
        historyStorage.clear(); // 清空本地搜索记录
        historyList.value = [];
      }
    },
  });
}
 */
export class HistoryStorage {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  // 获取
  get(): string[] {
    return uni.getStorageSync(this.key) || [];
  }

  // 添加
  add(word: string): void {
    if (!word) return;

    const list = this.get();
    // 先移除
    const i = list.indexOf(word);

    if (i !== -1) list.splice(i, 1);

    // 再添加在最前面
    list.unshift(word);

    // 缓存本地
    uni.setStorageSync(this.key, list);
  }

  // 删除
  remove(word: string): void {
    if (!word) return;

    const list = this.get();

    // 移除
    const i = list.indexOf(word);

    if (i !== -1) list.splice(i, 1);

    // 缓存本地
    uni.setStorageSync(this.key, list);
  }

  // 清空
  clear(): void {
    uni.removeStorageSync(this.key);
  }
}
