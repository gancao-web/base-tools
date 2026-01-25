# useCycleList

## 描述

循环列表。

## 示例

```ts
import { useCycleList } from '@base-web-kits/base-tools-vue';

const { state, next, prev } = useCycleList(['Dog', 'Cat', 'Lizard', 'Shark']);
console.log(state.value); // 'Dog'
next();
console.log(state.value); // 'Cat'
```

## 来源

[VueUse](https://vueuse.org/functions/useCycleList/)
