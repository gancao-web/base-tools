# useAsyncState

## 描述

响应式的异步状态。

## 示例

```ts
import { useAsyncState } from '@base-web-kits/base-tools-vue';
import axios from 'axios';

const { state, isReady, isLoading } = useAsyncState(
  axios.get('https://jsonplaceholder.typicode.com/todos/1').then(t => t.data),
  { id: null },
);
```

## 来源

[VueUse](https://vueuse.org/functions/useAsyncState/)
