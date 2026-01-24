# useUpdateEffect

## 描述

一个只在依赖更新时执行的 useEffect Hook。

## 示例

```ts
import { useUpdateEffect } from '@base-web-kits/base-tools-react';
import React, { useEffect, useState } from 'react';

export default () => {
  const [count, setCount] = useState(0);
  const [effectCount, setEffectCount] = useState(0);
  const [updateEffectCount, setUpdateEffectCount] = useState(0);

  useEffect(() => {
    setEffectCount((c) => c + 1);
  }, [count]);

  useUpdateEffect(() => {
    setUpdateEffectCount((c) => c + 1);
    return () => {
      // do something
    };
  }, [count]);

  return (
    <div>
      <p>effectCount: {effectCount}</p>
      <p>updateEffectCount: {updateEffectCount}</p>
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

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-update-effect)
