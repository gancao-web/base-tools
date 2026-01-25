# useEventSource

## 描述

响应式的 EventSource。

## 示例

```ts
import { useEventSource } from '@base-web-kits/base-tools-vue';

const { status, data, error, close } = useEventSource('https://example.com/sse');
```

## 来源

[VueUse](https://vueuse.org/functions/useEventSource/)
