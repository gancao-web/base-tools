# useParentElement

## 描述

获取 ref 的父元素。

## 示例

```ts
import { useParentElement } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const el = ref<HTMLElement | null>(null);
const parent = useParentElement(el);
```

## 来源

[VueUse](https://vueuse.org/functions/useParentElement/)
