# filterAsync

异步过滤数组元素。

## 示例

```ts
import { filterAsync } from '@base-web-kits/base-tools-ts';

const array = [1, 2, 3];
const result = await filterAsync(array, async (n) => n % 2 !== 0);
// 结果: [1, 3]
```

## 参数

- `collection (Array)`: 要迭代的集合。
- `predicate (Function)`: 异步过滤函数。

## 返回值

- `(Promise<Array>)`: 返回过滤后的新数组。

## 来源

- [es-toolkit filterAsync](https://es-toolkit.dev/zh_hans/reference/promise/filterAsync.html)
