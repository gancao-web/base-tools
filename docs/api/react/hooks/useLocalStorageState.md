# useLocalStorageState

## 描述

将状态存储在 localStorage 中。

## 示例

```ts
import { useLocalStorageState } from '@base-web-kits/base-tools-react';

const [message, setMessage] = useLocalStorageState('use-local-storage-state-demo1', {
  defaultValue: 'Hello~',
});
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-local-storage-state)
