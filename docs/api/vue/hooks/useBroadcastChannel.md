# useBroadcastChannel

## 描述

响应式的 BroadcastChannel API。

## 示例

```ts
import { useBroadcastChannel } from '@base-web-kits/base-tools-vue';

const { isSupported, channel, post, data, close, error } = useBroadcastChannel({ name: 'my-channel' });
```

## 来源

[VueUse](https://vueuse.org/functions/useBroadcastChannel/)
