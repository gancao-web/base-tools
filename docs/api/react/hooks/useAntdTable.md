# useAntdTable

## 描述

封装了 Ant Design Table 的逻辑，支持分页、排序、筛选等。

## 示例

```ts
import { useAntdTable } from '@base-web-kits/base-tools-react';

const { tableProps, search, params } = useAntdTable(getTableData, {
  defaultPageSize: 5,
  form,
});
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-antd-table)
