# useWhyDidYouUpdate

## 描述

帮助开发者排查是哪个属性改变导致了组件的重渲染。

## 示例

```ts
import { useWhyDidYouUpdate } from '@base-web-kits/base-tools-react';
import React, { useState } from 'react';

const Demo: React.FC<{ count: number }> = (props) => {
  useWhyDidYouUpdate('Demo', props);

  return <div>{props.count}</div>;
};

export default () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Demo count={count} />
      <button onClick={() => setCount((prev) => prev + 1)}>count + 1</button>
      <button onClick={() => setCount((prev) => prev)}>count unchanged</button>
    </div>
  );
};
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-why-did-you-update)
