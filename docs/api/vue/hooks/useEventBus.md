# useEventBus

## 描述

一个简单的事件总线。

## 示例

```ts
import { useEventBus } from '@base-web-kits/base-tools-vue';

const bus = useEventBus<string>('news');

const listener = (event: string) => {
  console.log(`Received: ${event}`);
};

bus.on(listener);
bus.emit('The Tokyo Olympics has begun');
```

## 来源

[VueUse](https://vueuse.org/functions/useEventBus/)
