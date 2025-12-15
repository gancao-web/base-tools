# Nullable

可空类型（包含 `null` 和 `undefined`）。

## 示例

```ts
import { Nullable } from '@base-web-kits/base-tools-ts';

type R = Nullable<string>;
// 结果: string | null | undefined
```

## 版本

- 1.0.0 新增