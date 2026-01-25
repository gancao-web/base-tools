# useUnmountedRef

## 描述

获取当前组件是否已经卸载的 Hook。

## 示例

```ts
import { useUnmountedRef } from '@base-web-kits/base-tools-react';
import { useBoolean } from 'ahooks';
import React, { useEffect } from 'react';

const MyComponent = () => {
  const unmountedRef = useUnmountedRef();
  useEffect(() => {
    setTimeout(() => {
      if (!unmountedRef.current) {
        console.log('component is alive');
      }
    }, 3000);
  }, []);

  return <p>Hello World!</p>;
};

export default () => {
  const [state, { toggle }] = useBoolean(true);

  return (
    <>
      <button type="button" onClick={toggle}>
        {state ? 'Unmount' : 'Mount'}
      </button>
      {state && <MyComponent />}
    </>
  );
};
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-unmounted-ref)
