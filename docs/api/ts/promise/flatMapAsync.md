# flatMapAsync

异步映射并扁平化数组。

## 示例

```ts
import { flatMapAsync } from '@base-web-kits/base-tools-ts';

const array = [1, 2, 3];
const result = await flatMapAsync(array, async (n) => [n, n]);
// 结果: [1, 1, 2, 2, 3, 3]
```

## 参数

- `collection (Array)`: 要迭代的集合。
- `iteratee (Function)`: 异步映射函数。

## 返回值

- `(Promise<Array>)`: 返回新数组。

## 来源

- [es-toolkit flatMapAsync](https://es-toolkit.dev/zh_hans/reference/promise/flatMapAsync.html)
