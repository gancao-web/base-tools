# useRefHistory

## 描述

跟踪 ref 的历史记录。

## 示例

```ts
import { useRefHistory } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const { history, undo, redo } = useRefHistory(count);
```

## 来源

[VueUse](https://vueuse.org/functions/useRefHistory/)
