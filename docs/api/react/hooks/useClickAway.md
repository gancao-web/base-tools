# useClickAway

监听目标元素外的点击事件。

## 示例

```ts
import { useClickAway } from '@base-web-kits/base-tools-react';

useClickAway(() => {
  setOpen(false);
}, ref);
```

## 参数

- `onClickAway (Function)`: 触发回调。
- `target (Element|Ref)`: 监听目标。

## 来源

- [ahooks useClickAway](https://ahooks.js.org/zh-CN/hooks/use-click-away/index)
