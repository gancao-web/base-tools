# unionBy

类似 `union`，但是接受一个 `iteratee` 调用每个元素。

## 示例

```ts
import { unionBy } from '@base-web-kits/base-tools-ts';

unionBy([2.1], [1.2, 2.3], Math.floor);
// 结果: [2.1, 1.2]
```

## 参数

- `arrays (...Array)`: 要检查的数组。
- `iteratee (Function)`: 调用每个元素的迭代函数。

## 返回值

- `(Array)`: 返回新数组。

## 来源

- [es-toolkit unionBy](https://es-toolkit.dev/zh_hans/reference/array/unionBy.html)
