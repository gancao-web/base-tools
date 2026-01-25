# useTimeout

## 描述

一个可以处理 setTimeout 计时器函数的 Hook。

## 示例

```ts
import { useTimeout } from '@base-web-kits/base-tools-react';
import React, { useState } from 'react';

export default () => {
  const [state, setState] = useState(1);
  useTimeout(() => {
    setState(state + 1);
  }, 3000);

  return <div>{state}</div>;
};
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-timeout)
