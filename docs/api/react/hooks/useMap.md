# useMap

## 描述

管理 Map 状态的 Hook。

## 示例

```ts
import { useMap } from '@base-web-kits/base-tools-react';

const [map, { set, setAll, remove, reset, get }] = useMap([
  ['hello', 'world'],
  ['foo', 'bar'],
]);
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-map)
