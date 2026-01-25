# useCloned

## 描述

响应式的克隆 ref。

## 示例

```ts
import { useCloned } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const source = ref({ foo: 'bar' });
const { cloned, sync } = useCloned(source);
```

## 来源

[VueUse](https://vueuse.org/functions/useCloned/)
