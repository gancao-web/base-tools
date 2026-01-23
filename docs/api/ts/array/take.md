# take

创建一个切片数组，从 `array` 开始提取 `n` 个元素。

## 示例

```ts
import { take } from '@base-web-kits/base-tools-ts';

take([1, 2, 3]);
// 结果: [1]

take([1, 2, 3], 2);
// 结果: [1, 2]
```

## 参数

- `array (Array)`: 要查询的数组。
- `n (number)`: 要提取的元素个数。

## 返回值

- `(Array)`: 返回数组切片。

## 来源

- [es-toolkit take](https://es-toolkit.dev/zh_hans/reference/array/take.html)
