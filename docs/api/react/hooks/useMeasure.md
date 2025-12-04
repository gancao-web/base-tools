# useMeasure

监听元素尺寸与位置变化，返回回调 `ref` 和最新的 `DOMRectReadOnly`。

## 示例

```tsx
import { useMeasure } from '@base-web-kits/base-tools-react';

function Component() {
  const [ref, rect] = useMeasure();
  return (
    <div ref={ref}>
      w:{rect.width} h:{rect.height}
    </div>
  );
}
```

## 版本

- 1.0.0 新增
