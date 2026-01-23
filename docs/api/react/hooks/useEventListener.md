# useEventListener

优雅的使用 addEventListener。

## 示例

```ts
import { useEventListener } from '@base-web-kits/base-tools-react';

useEventListener('click', () => console.log('click'), { target: document.body });
```

## 参数

- `eventName (string)`: 事件名称。
- `handler (Function)`: 事件处理函数。
- `options (Object)`: 配置项。

## 来源

- [ahooks useEventListener](https://ahooks.js.org/zh-CN/hooks/use-event-listener/index)
