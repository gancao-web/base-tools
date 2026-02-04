# keyBy

创建一个对象，key 是 `iteratee` 遍历 `collection` 中的每个元素返回的结果。

## 示例

```ts
import { keyBy } from '@base-web-kits/base-tools-ts';

const array = [
  { dir: 'left', code: 97 },
  { dir: 'right', code: 100 },
];

keyBy(array, (o) => String.fromCharCode(o.code));
// 结果: { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
```

## 参数

- `collection (Array)`: 要迭代的集合。
- `iteratee (Function)`: 每次迭代调用的函数。

## 返回值

- `(Object)`: 返回组成的对象。

## 来源

- [es-toolkit keyBy](https://es-toolkit.dev/zh_hans/reference/array/keyBy.html)
