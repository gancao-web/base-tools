# xorWith

类似 `xor`，但是接受一个 `comparator` 比较每个元素。

## 示例

```ts
import { xorWith } from '@base-web-kits/base-tools-ts';

const objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
const others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];

xorWith(objects, others, isEqual);
// 结果: [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
```

## 参数

- `arrays (...Array)`: 要检查的数组。
- `comparator (Function)`: 比较每个元素的函数。

## 返回值

- `(Array)`: 返回新数组。

## 来源

- [es-toolkit xorWith](https://es-toolkit.dev/zh_hans/reference/array/xorWith.html)
