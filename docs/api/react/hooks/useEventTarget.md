# useEventTarget

## 描述

简化 Input 或类似组件的状态管理。

## 示例

```ts
import { useEventTarget } from '@base-web-kits/base-tools-react';

const [value, { onChange, reset }] = useEventTarget({ initialValue: 'this is initial value' });
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-event-target)
