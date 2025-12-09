# setObjectValue

设置对象值。

- 支持点路径 `'a.b[0].name'` 和数组路径 `['a', 'b', 0, 'name']`。
- 如果路径不存在，会自动创建对象或数组。

## 示例

```ts
import { setObjectValue } from '@base-web-kits/base-tools-ts';

const o = { b: { c: 'x' }, users: [{ name: 'john' }, { name: 'jane' }] };
setObjectValue(o, 'b.c', 'y'); // 点路径
setObjectValue(o, 'users[0].name', 'john-doe');
setObjectValue(o, ['users', 1, 'name'], 'jane-doe'); // 数组路径
```

## 版本

- 1.0.0 新增
