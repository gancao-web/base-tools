# UnionToIntersection

将联合类型转换为交叉类型。

## 示例

```ts
import { UnionToIntersection } from '@base-web-kits/base-tools-ts';

type I = UnionToIntersection<{ a: 1 } | { b: 2 }>;
// 结果: { a: 1 } & { b: 2 }
```

## 版本

- 1.0.0 新增
