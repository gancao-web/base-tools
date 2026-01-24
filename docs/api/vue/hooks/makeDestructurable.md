# makeDestructurable

## 描述

使对象可解构。

## 示例

```ts
import { makeDestructurable } from '@base-web-kits/base-tools-vue';

const obj = makeDestructurable({ foo: 1, bar: 2 }, [1, 2]);
const { foo, bar } = obj;
const [foo2, bar2] = obj;
```

## 来源

[VueUse](https://vueuse.org/functions/makeDestructurable/)
