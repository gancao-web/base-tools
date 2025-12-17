# SetRequired

将指定属性设为必填（不改变其他属性）。

## 示例

```ts
import { SetRequired } from '@base-web-kits/base-tools-ts';

type User = { id?: number; name?: string; age?: number };
type U1 = SetRequired<User, 'id' | 'name'>;
// 结果: { id: number; name: string; age?: number }
```

## 版本

- 1.0.0 新增
