# useDeepCompareEffect

## 描述

用法与 useEffect 一致，但 deps 通过 lodash isEqual 进行深比较。

## 示例

```ts
import { useDeepCompareEffect } from '@base-web-kits/base-tools-react';

useDeepCompareEffect(() => {
  // ...
}, [deepObject]);
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-deep-compare-effect)
