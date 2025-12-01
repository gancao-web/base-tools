# HistoryStorage

本地记录管理类, 常用于搜索记录的本地化管理

## 示例

```ts
import { HistoryStorage } from '@base-web-kits/base-tools-uni';

const historyStorage = new HistoryStorage('xxx-search-history'); // 创建管理对象

const historyList = ref(historyStorage.get()); // 获取搜索记录列表

function onSearch(word: string) {
  if (!word) return;
  historyStorage.add(word); // 添加搜索记录到本地 (最新的在前)
  href('xxx?word=' + word);
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
```
