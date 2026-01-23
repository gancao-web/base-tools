# memoize

创建一个会缓存 `func` 结果的函数。

## 示例

```ts
import { memoize } from '@base-web-kits/base-tools-ts';

const object = { 'a': 1, 'b': 2 };
const other = { 'c': 3, 'd': 4 };

const values = memoize(Object.values);
values(object);
// 结果: [1, 2]

values(other);
// 结果: [3, 4]
```

## 参数

- `func (Function)`: 要缓存的函数。
- `resolver (Function)`: 决定缓存 key 的函数。

## 返回值

- `(Function)`: 返回缓存函数。

## 来源

- [es-toolkit memoize](https://es-toolkit.dev/zh_hans/reference/function/memoize.html)
