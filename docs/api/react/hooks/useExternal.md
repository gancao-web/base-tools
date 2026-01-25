# useExternal

## 描述

动态注入 JS 或 CSS 资源。

## 示例

```ts
import { useExternal } from '@base-web-kits/base-tools-react';

const status = useExternal('/path/to/script.js', {
  js: { async: true },
});
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-external)
