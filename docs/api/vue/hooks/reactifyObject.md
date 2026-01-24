# reactifyObject

## 描述

将对象的方法转换为响应式函数。

## 示例

```ts
import { reactifyObject } from '@base-web-kits/base-tools-vue';

const obj = {
  add(a: number, b: number) {
    return a + b;
  },
};
const reactiveObj = reactifyObject(obj);
```

## 来源

[VueUse](https://vueuse.org/functions/reactifyObject/)
