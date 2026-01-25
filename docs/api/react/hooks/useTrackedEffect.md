# useTrackedEffect

## 描述

追踪是哪个依赖变化触发了 useEffect 的执行。

## 示例

```ts
import { useTrackedEffect } from '@base-web-kits/base-tools-react';
import React, { useState } from 'react';

export default () => {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  useTrackedEffect(
    (changes) => {
      console.log('Index of changed dependencies: ', changes);
    },
    [count, count2],
  );

  return (
    <div>
      <p>Please open the console to view the output</p>
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount((c) => c + 1)}>count + 1</button>
      </div>
      <div style={{ marginTop: 16 }}>
        <p>Count2: {count2}</p>
        <button onClick={() => setCount2((c) => c + 1)}>count2 + 1</button>
      </div>
    </div>
  );
};
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-tracked-effect)
