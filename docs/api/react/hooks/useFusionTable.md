# useFusionTable

## 描述

封装了 Fusion Design Table 的逻辑，支持分页、排序、筛选等。

## 示例

```ts
import { useFusionTable } from '@base-web-kits/base-tools-react';

const { tableProps, search } = useFusionTable(getTableData, {
  field,
});
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-fusion-table)
