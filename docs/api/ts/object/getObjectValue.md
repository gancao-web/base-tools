# getObjectValue

获取对象值。

- 支持点路径 `'a.b[0].name'` 和数组路径 `['a', 'b', 0, 'name']`。

## 示例

```ts
import { getObjectValue } from '@base-web-kits/base-tools-ts';

const o = { b: { c: 'x' }, users: [{ name: 'john' }, { name: 'jane' }] };
const c = getObjectValue(o, 'b.c'); // 点路径: 'x'
const name0 = getObjectValue(o, 'users[0].name'); // 数组字符: 'john'
const name1 = getObjectValue(o, ['users', 1, 'name']); // 数组路径: 'jane'
```

## 版本

- 1.0.0 新增
