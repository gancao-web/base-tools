# getDateRangeBefore

获取“前几天”的日期范围

## 示例

```ts
import { getDateRangeBefore } from '@base-web-kits/base-tools-ts';
// 若今天为 2025-11-19：
getDateRangeBefore(1); // ['2025-11-18', '2025-11-19']
getDateRangeBefore(1, 'YYYY-MM-DD HH:mm:ss'); // ['2025-11-18 00:00:00', '2025-11-19 23:59:59']
```

## 版本

- 1.0.0 新增
