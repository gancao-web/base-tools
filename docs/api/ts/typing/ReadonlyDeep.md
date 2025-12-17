# ReadonlyDeep

深度只读（递归添加 `readonly`）。

## 示例

```ts
import { ReadonlyDeep } from '@base-web-kits/base-tools-ts';

type R = ReadonlyDeep<{ a: { b: number }; list: { id: string }[] }>;
// 结果: { readonly a: { readonly b: number }; readonly list: readonly { readonly id: string }[] }
```

## 版本

- 1.0.0 新增