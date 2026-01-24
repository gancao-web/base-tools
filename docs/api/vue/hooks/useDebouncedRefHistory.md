# useDebouncedRefHistory

## 描述

带防抖的 ref 历史记录。

## 示例

```ts
import { useDebouncedRefHistory } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const { history, undo, redo } = useDebouncedRefHistory(count, { debounce: 1000 });
```

## 来源

[VueUse](https://vueuse.org/functions/useDebouncedRefHistory/)
