# refWithControl

## 描述

带控制的 ref。

## 示例

```ts
import { refWithControl } from '@base-web-kits/base-tools-vue';

const count = refWithControl(0);
count.set(1, false); // 不触发更新
```

## 来源

[VueUse](https://vueuse.org/functions/refWithControl/)
