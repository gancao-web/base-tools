# Brand

创建名义类型（品牌化类型），用于区分结构相同但逻辑意义不同的类型。

## 示例

```ts
import { Brand } from '@base-web-kits/base-tools-ts';

type UserId = Brand<number, 'UserId'>;
type PostId = Brand<number, 'PostId'>;

const id1 = 1 as UserId;
const id2 = 1 as PostId;
// id1 = id2; // Error: 不能将 PostId 赋值给 UserId
```

## 版本

- 1.0.0 新增
