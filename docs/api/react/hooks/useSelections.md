# useSelections

## 描述

常见 Checkbox 列表选中状态管理。

## 示例

```ts
import { useSelections } from '@base-web-kits/base-tools-react';

const { selected, isSelected, toggle, selectAll, unSelectAll, noneSelected, allSelected, partiallySelected, setSelected } = useSelections(
  ['a', 'b', 'c'],
  ['a'],
);
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-selections)
