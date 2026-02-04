# omitBy

创建一个对象，其属性由 `predicate` 返回假值。

## 示例

```ts
import { omitBy } from '@base-web-kits/base-tools-ts';

const object = { a: 1, b: '2', c: 3 };

omitBy(object, isNumber);
// 结果: { 'b': '2' }
```

## 参数

- `object (Object)`: 来源对象。
- `predicate (Function)`: 每次迭代调用的函数。

## 返回值

- `(Object)`: 返回新对象。

## 来源

- [es-toolkit omitBy](https://es-toolkit.dev/zh_hans/reference/object/omitBy.html)
