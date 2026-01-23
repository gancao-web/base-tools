# uniqBy

类似 `uniq`，但是接受一个 `iteratee` 调用每个元素。

## 示例

```ts
import { uniqBy } from '@base-web-kits/base-tools-ts';

uniqBy([2.1, 1.2, 2.3], Math.floor);
// 结果: [2.1, 1.2]
```

## 参数

- `array (Array)`: 要检查的数组。
- `iteratee (Function)`: 调用每个元素的迭代函数。

## 返回值

- `(Array)`: 去重后的新数组。

## 来源

- [es-toolkit uniqBy](https://es-toolkit.dev/zh_hans/reference/array/uniqBy.html)
