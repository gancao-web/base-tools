# useEventEmitter

在多个组件之间进行事件通知。

## 示例

```ts
import { useEventEmitter } from '@base-web-kits/base-tools-react';

const event$ = useEventEmitter();
```

## 返回值

- `(Object)`: 事件对象，包含 emit 和 useSubscription。

## 来源

- [ahooks useEventEmitter](https://ahooks.js.org/zh-CN/hooks/use-event-emitter/index)
