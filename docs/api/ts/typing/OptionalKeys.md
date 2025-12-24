# OptionalKeys

获取可选属性的键名联合。

## 示例

```ts
import { OptionalKeys } from '@base-web-kits/base-tools-ts';

type K = OptionalKeys<{ a?: number; b: string }>;
// 结果: 'a'
```

## 版本

- 1.0.0 新增
