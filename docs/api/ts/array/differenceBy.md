# differenceBy

类似 `difference`，但是接受一个 `iteratee` 调用每个元素。

## 示例

```ts
import { differenceBy } from '@base-web-kits/base-tools-ts';

differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
// 结果: [1.2]
```

## 参数

- `array (Array)`: 要检查的数组。
- `values (Array)`: 要排除的值的数组。
- `iteratee (Function)`: 调用每个元素的迭代函数。

## 返回值

- `(Array)`: 过滤后的新数组。

## 来源

- [es-toolkit differenceBy](https://es-toolkit.dev/zh_hans/reference/array/differenceBy.html)
