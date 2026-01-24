# objectOmit

## 描述

从对象中忽略属性。

## 示例

```ts
import { objectOmit } from '@base-web-kits/base-tools-vue';

const obj = { a: 1, b: 2, c: 3 };
const omitted = objectOmit(obj, ['a', 'b']); // { c: 3 }
```来源

[VueUse](https://vueuse.org/functions/objectOmit/)
