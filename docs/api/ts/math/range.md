# range

创建一个包含从 `start` 到 `end`，但不包含 `end` 的数字数组。

## 示例

```ts
import { range } from '@base-web-kits/base-tools-ts';

range(4);
// 结果: [0, 1, 2, 3]

range(1, 5);
// 结果: [1, 2, 3, 4]

range(0, 20, 5);
// 结果: [0, 5, 10, 15]
```

## 参数

- `start (number)`: 开始范围。
- `end (number)`: 结束范围。
- `step (number)`: 步长。

## 返回值

- `(number[])`: 返回数字数组。

## 来源

- [es-toolkit range](https://es-toolkit.dev/zh_hans/reference/math/range.html)
