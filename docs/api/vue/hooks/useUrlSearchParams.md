# useUrlSearchParams

## 描述

响应式的 URLSearchParams。

## 示例

```ts
import { useUrlSearchParams } from '@base-web-kits/base-tools-vue';

const params = useUrlSearchParams('history');

console.log(params.foo); // url?foo=bar -> bar
params.foo = 'baz'; // url?foo=baz
```

## 来源

[VueUse](https://vueuse.org/functions/useUrlSearchParams/)
