# useKeyPress

## 描述

监听键盘按键，支持组合键。

## 示例

```ts
import { useKeyPress } from '@base-web-kits/base-tools-react';

useKeyPress('leftarrow', () => {
  setCounter((s) => s - 1);
});
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-key-press)
