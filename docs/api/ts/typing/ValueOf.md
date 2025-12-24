# ValueOf

获取对象属性值的联合类型。

## 示例

```ts
import { ValueOf } from '@base-web-kits/base-tools-ts';

type V = ValueOf<{ a: 1; b: 'x' }>;
// 结果: 1 | 'x'
```

## 版本

- 1.0.0 新增
