# fill

使用 `value` 值来填充（替换） `array`，从 `start` 位置开始, 到 `end` 位置结束（但不包含 `end` 位置）。

## 示例

```ts
import { fill } from '@base-web-kits/base-tools-ts';

const array = [1, 2, 3];
fill(array, 'a');
// 结果: ['a', 'a', 'a']

fill(Array(3), 2);
// 结果: [2, 2, 2]

fill([4, 6, 8, 10], '*', 1, 3);
// 结果: [4, '*', '*', 10]
```

## 参数

- `array (Array)`: 要填充的数组。
- `value (any)`: 填充的值。
- `start (number)`: 开始位置。
- `end (number)`: 结束位置。

## 返回值

- `(Array)`: 返回 `array`。

## 来源

- [es-toolkit fill](https://es-toolkit.dev/zh_hans/reference/array/fill.html)
