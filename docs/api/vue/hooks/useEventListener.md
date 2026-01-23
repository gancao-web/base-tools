# useEventListener

使用 EventListener。

## 示例

```ts
import { useEventListener } from '@base-web-kits/base-tools-vue';

useEventListener(document, 'click', () => console.log('clicked'));
```

## 参数

- `target (Element|Window|Document)`: 目标。
- `event (string)`: 事件名。
- `listener (Function)`: 监听器。

## 来源

- [VueUse useEventListener](https://vueuse.org/core/useEventListener/)
