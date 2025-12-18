# RequiredKeys

获取必填属性的键名联合。

## 示例

```ts
import { RequiredKeys } from '@base-web-kits/base-tools-ts';

type K = RequiredKeys<{ a?: number; b: string }>;
// 结果: 'b'
```

## 版本

- 1.0.0 新增
