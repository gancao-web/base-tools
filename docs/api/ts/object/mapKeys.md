# mapKeys

创建一个对象，key 是 `iteratee` 遍历 `object` 中的每个属性返回的结果。

## 示例

```ts
import { mapKeys } from '@base-web-kits/base-tools-ts';

mapKeys({ a: 1, b: 2 }, (value, key) => key + value);
// 结果: { 'a1': 1, 'b2': 2 }
```

## 参数

- `object (Object)`: 要迭代的对象。
- `iteratee (Function)`: 每次迭代调用的函数。

## 返回值

- `(Object)`: 返回新对象。

## 来源

- [es-toolkit mapKeys](https://es-toolkit.dev/zh_hans/reference/object/mapKeys.html)
