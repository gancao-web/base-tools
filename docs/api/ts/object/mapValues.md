# mapValues

创建一个对象，value 是 `iteratee` 遍历 `object` 中的每个属性返回的结果。

## 示例

```ts
import { mapValues } from '@base-web-kits/base-tools-ts';

const users = {
  'fred':    { 'user': 'fred',    'age': 40 },
  'pebbles': { 'user': 'pebbles', 'age': 1 }
};

mapValues(users, o => o.age);
// 结果: { 'fred': 40, 'pebbles': 1 }
```

## 参数

- `object (Object)`: 要迭代的对象。
- `iteratee (Function)`: 每次迭代调用的函数。

## 返回值

- `(Object)`: 返回新对象。

## 来源

- [es-toolkit mapValues](https://es-toolkit.dev/zh_hans/reference/object/mapValues.html)
