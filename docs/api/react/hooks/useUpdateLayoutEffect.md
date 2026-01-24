# useUpdateLayoutEffect

## 描述

一个只在依赖更新时执行的 useLayoutEffect Hook。

## 示例

```ts
import { useUpdateLayoutEffect } from '@base-web-kits/base-tools-react';
import React, { useLayoutEffect, useState } from 'react';

export default () => {
  const [count, setCount] = useState(0);
  const [layoutEffectCount, setLayoutEffectCount] = useState(0);
  const [updateLayoutEffectCount, setUpdateLayoutEffectCount] = useState(0);

  useLayoutEffect(() => {
    setLayoutEffectCount((c) => c + 1);
  }, [count]);

  useUpdateLayoutEffect(() => {
    setUpdateLayoutEffectCount((c) => c + 1);
    return () => {
      // do something
    };
  }, [count]);

  return (
    <div>
      <p>layoutEffectCount: {layoutEffectCount}</p>
      <p>updateLayoutEffectCount: {updateLayoutEffectCount}</p>
      <p>
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          reRender
        </button>
      </p>
    </div>
  );
};
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-update-layout-effect)
