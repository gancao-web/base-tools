# mapAsync

异步映射数组元素。

## 示例

```ts
import { mapAsync } from '@base-web-kits/base-tools-ts';

const array = [1, 2, 3];
const result = await mapAsync(array, async (n) => n * 2);
// 结果: [2, 4, 6]
```

## 参数

- `collection (Array)`: 要迭代的集合。
- `iteratee (Function)`: 异步映射函数。

## 返回值

- `(Promise<Array>)`: 返回新数组。

## 来源

- [es-toolkit mapAsync](https://es-toolkit.dev/zh_hans/reference/promise/mapAsync.html)
