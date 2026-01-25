# useTimeoutPoll

## 描述

轮询执行函数，支持超时控制。

## 示例

```ts
import { useTimeoutPoll } from '@base-web-kits/base-tools-vue';

async function fetchData() {
  // fetch something
}

const { isActive, pause, resume } = useTimeoutPoll(fetchData, 1000);
```

## 来源

[VueUse](https://vueuse.org/functions/useTimeoutPoll/)
