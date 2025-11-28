# getDateRangeAfter
获取“后几天”的日期范围

## Example

```ts
import { getDateRangeAfter } from '@base-web-kits/base-tools/ts';
若今天为 2025-11-19：
getDateRangeAfter(1) // ['2025-11-19', '2025-11-20']
getDateRangeAfter(1, 'YYYY-MM-DD HH:mm:ss') // ['2025-11-19 00:00:00', '2025-11-20 23:59:59']
```