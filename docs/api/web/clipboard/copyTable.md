# copyTable

复制表格到剪贴板（移动端与 PC）  
同时写入多种 MIME：`text/html`（表格）、`text/tab-separated-values`（TSV）、`text/csv`、`text/plain`（TSV）。  
使用场景：优化粘贴到 Excel/Google Sheets/Docs 的体验

## 示例

```ts
import { copyTable } from '@base-web-kits/base-tools-web';

await copyTable([
  ['姓名', '分数'],
  ['张三', 95],
  ['李四', 88],
]);
```

## 版本

- 1.0.0 新增
