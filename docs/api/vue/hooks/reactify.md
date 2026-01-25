# reactify

## 描述

将普通函数转换为响应式函数。

## 示例

```ts
import { reactify } from '@base-web-kits/base-tools-vue';

const add = (a: number, b: number) => a + b;
const reactiveAdd = reactify(add);
```

## 来源

[VueUse](https://vueuse.org/functions/reactify/)
