# setSSRHandler

## 描述

设置 SSR 处理器。

## 示例

```ts
import { setSSRHandler } from '@base-web-kits/base-tools-vue';

setSSRHandler('isClient', () => typeof window !== 'undefined');
```

## 来源

[VueUse](https://vueuse.org/functions/setSSRHandler/)
