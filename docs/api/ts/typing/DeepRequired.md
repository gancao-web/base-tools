# DeepRequired

深度必填（递归移除所有可选标记）。

## 示例

```ts
import { DeepRequired } from '@base-web-kits/base-tools-ts';

type T = { a?: { b?: number } };
type R = DeepRequired<T>;
// 结果: { a: { b: number } }
```

## 版本

- 1.0.0 新增
