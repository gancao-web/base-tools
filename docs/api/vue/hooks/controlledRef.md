# controlledRef

## 描述

受控的 ref (refWithControl 的别名)。

## 示例

````ts
import { controlledRef } from '@base-web-kits/base-tools-vue';

const count = controlledRef(0);
count.set(1, false); // 不触发更新
```来源

[VueUse](https://vueuse.org/functions/controlledRef/)
````
