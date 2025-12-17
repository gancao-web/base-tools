# Mutable

取消只读（顶层移除 `readonly`）。

## 示例

```ts
import { Mutable } from '@base-web-kits/base-tools-ts';

type R = Mutable<Readonly<{ a: number }>>;
// 结果: { a: number }
```

## 版本

- 1.0.0 新增