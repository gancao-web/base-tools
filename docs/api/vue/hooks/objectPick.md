# objectPick

## 描述

从对象中挑选属性。

## 示例

````ts
import { objectPick } from '@base-web-kits/base-tools-vue';

const obj = { a: 1, b: 2, c: 3 };
const picked = objectPick(obj, ['a', 'b']); // { a: 1, b: 2 }
```来源

[VueUse](https://vueuse.org/functions/objectPick/)
````
