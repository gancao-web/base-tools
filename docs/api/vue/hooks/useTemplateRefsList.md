# useTemplateRefsList

## 描述

将 v-for 循环中的 refs 绑定到一个数组。

## 示例

```ts
import { useTemplateRefsList } from '@base-web-kits/base-tools-vue';

const refs = useTemplateRefsList<HTMLDivElement>();

// <div v-for="i in 5" :key="i" :ref="refs.set"></div>
```

## 来源

[VueUse](https://vueuse.org/functions/useTemplateRefsList/)
