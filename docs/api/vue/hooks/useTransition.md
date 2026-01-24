# useTransition

## 描述

在值之间进行过渡。

## 示例

```ts
import { useTransition } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const source = ref(0);
const output = useTransition(source, {
  duration: 1000,
});

source.value = 100;
// output.value 将在 1000ms 内从 0 过渡到 100
```

## 来源

[VueUse](https://vueuse.org/functions/useTransition/)
