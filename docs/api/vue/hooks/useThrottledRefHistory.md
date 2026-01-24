# useThrottledRefHistory

## 描述

带有节流功能的 ref 历史记录。

## 示例

```ts
import { useThrottledRefHistory } from '@base-web-kits/base-tools-vue';
import { ref } from 'vue';

const count = ref(0);
const { history, undo, redo } = useThrottledRefHistory(count, { throttle: 1000 });
```

## 来源

[VueUse](https://vueuse.org/functions/useThrottledRefHistory/)
