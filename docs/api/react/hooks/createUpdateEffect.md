# createUpdateEffect

## 描述

创建一个只在依赖更新时执行的 useEffect Hook。

## 示例

```ts
import { createUpdateEffect } from '@base-web-kits/base-tools-react';
import { useEffect } from 'react';

// 使用
const useUpdateEffect = createUpdateEffect(useEffect);
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/create-update-effect)
