# useManualRefHistory

## 描述

手动跟踪 ref 的历史记录。

## 示例

```ts
import { useManualRefHistory } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const { history, commit, undo, redo } = useManualRefHistory(count);

count.value = 1;
commit();
```

## 来源

[VueUse](https://vueuse.org/functions/useManualRefHistory/)
