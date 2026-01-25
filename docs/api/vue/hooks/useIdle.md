# useIdle

## 描述

检测用户是否空闲。

## 示例

```ts
import { useIdle } from '@base-web-kits/base-tools-vue';

const { idle, lastActive } = useIdle(5 * 60 * 1000); // 5 minutes
```

## 来源

[VueUse](https://vueuse.org/functions/useIdle/)
