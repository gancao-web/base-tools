# Merge

合并两个类型（以 `U` 覆盖 `T` 的同名属性）。

## 示例

```ts
import { Merge } from '@base-web-kits/base-tools-ts';

type R = Merge<{ a: 1; b: 2 }, { b: 3; c: 4 }>;
// 结果: { a: 1; b: 3; c: 4 }
```

## 版本

- 1.0.0 新增
