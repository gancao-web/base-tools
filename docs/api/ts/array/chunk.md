# chunk

将数组拆分成指定大小的块。

## 示例

```ts
import { chunk } from '@base-web-kits/base-tools-ts';

chunk(['a', 'b', 'c', 'd'], 2);
// 返回: [['a', 'b'], ['c', 'd']]

chunk(['a', 'b', 'c', 'd'], 3);
// 返回: [['a', 'b', 'c'], ['d']]
```

## 参数

- `arr (T[])`: 要拆分的数组。
- `size (number)`: 每个块的大小。

## 返回值

- `(T[][])`: 包含拆分后块的新数组。

## 来源

- [es-toolkit chunk](https://es-toolkit.dev/zh_hans/reference/array/chunk.html)
