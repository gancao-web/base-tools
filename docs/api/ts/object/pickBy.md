# pickBy

创建一个对象，其属性由 `predicate` 返回真值。

## 示例

```ts
import { pickBy } from '@base-web-kits/base-tools-ts';

const object = { 'a': 1, 'b': '2', 'c': 3 };

pickBy(object, isNumber);
// 结果: { 'a': 1, 'c': 3 }
```

## 参数

- `object (Object)`: 来源对象。
- `predicate (Function)`: 每次迭代调用的函数。

## 返回值

- `(Object)`: 返回新对象。

## 来源

- [es-toolkit pickBy](https://es-toolkit.dev/zh_hans/reference/object/pickBy.html)
