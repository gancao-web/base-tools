# findKey

这个方法类似 `find`，但是返回 key 而不是元素。

## 示例

```ts
import { findKey } from '@base-web-kits/base-tools-ts';

const users = {
  barney: { age: 36, active: true },
  fred: { age: 40, active: false },
  pebbles: { age: 1, active: true },
};

findKey(users, (o) => o.age < 40);
// 结果: 'barney' (或者 'pebbles'，取决于遍历顺序)
```

## 参数

- `object (Object)`: 要查询的对象。
- `predicate (Function)`: 每次迭代调用的函数。

## 返回值

- `(string|undefined)`: 返回匹配的 key，否则返回 `undefined`。

## 来源

- [es-toolkit findKey](https://es-toolkit.dev/zh_hans/reference/object/findKey.html)
