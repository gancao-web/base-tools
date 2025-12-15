# DeepPartial

深度可选（递归将所有属性设为可选）。

## 示例

```ts
import { DeepPartial } from '@base-web-kits/base-tools-ts';

type T = { a: { b: number }; list: Array<{ id: string }> };
type R = DeepPartial<T>;
// 结果: { a?: { b?: number }; list?: Array<{ id?: string }> }
```

## 版本

- 1.0.0 新增