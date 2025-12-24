# SetOptional

将指定属性设为可选（不改变其他属性）。

## 示例

```ts
import { SetOptional } from '@base-web-kits/base-tools-ts';

type User = { id: number; name: string; age: number };
type U2 = SetOptional<User, 'age'>;
// 结果: { id: number; name: string; age?: number }
```

## 版本

- 1.0.0 新增
