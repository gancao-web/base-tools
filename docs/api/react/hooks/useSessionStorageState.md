# useSessionStorageState

## 描述

将状态存储在 sessionStorage 中。

## 示例

```ts
import { useSessionStorageState } from '@base-web-kits/base-tools-react';

const [message, setMessage] = useSessionStorageState('use-session-storage-state-demo1', {
  defaultValue: 'Hello~',
});
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-session-storage-state)
