# reduceAsync

异步归约数组元素。

## 示例

```ts
import { reduceAsync } from '@base-web-kits/base-tools-ts';

const array = [1, 2, 3];
const result = await reduceAsync(array, async (acc, n) => acc + n, 0);
// 结果: 6
```

## 参数

- `collection (Array)`: 要迭代的集合。
- `iteratee (Function)`: 异步归约函数。
- `accumulator (any)`: 初始值。

## 返回值

- `(Promise<any>)`: 返回归约后的值。

## 来源

- [es-toolkit reduceAsync](https://es-toolkit.dev/zh_hans/reference/promise/reduceAsync.html)
