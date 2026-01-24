# useVirtualList

## 描述

提供虚拟化列表能力的 Hook，用于处理大量数据的渲染性能问题。

## 示例

```ts
import { useVirtualList } from '@base-web-kits/base-tools-react';
import React, { useMemo, useRef } from 'react';

export default () => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  
  const originalList = useMemo(() => Array.from(Array(99999).keys()), []);

  const [list] = useVirtualList(originalList, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 60,
    overscan: 10,
  });

  return (
    <div ref={containerRef} style={{ height: '300px', overflow: 'auto', border: '1px solid' }}>
      <div ref={wrapperRef}>
        {list.map((ele) => (
          <div
            style={{
              height: 52,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #e8e8e8',
              marginBottom: 8,
            }}
            key={ele.index}
          >
            Row: {ele.data}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-virtual-list)
