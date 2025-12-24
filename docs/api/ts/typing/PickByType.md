# PickByType

按值类型挑选属性。

## 示例

```ts
import { PickByType } from '@base-web-kits/base-tools-ts';

type R = PickByType<{ a: string; b: number; c: string }, string>;
// 结果: { a: string; c: string }
```

## 版本

- 1.0.0 新增
