# drop

创建一个切片数组，去除 `array` 前面的 `n` 个元素。

## 示例

```ts
import { drop } from '@base-web-kits/base-tools-ts';

drop([1, 2, 3]);
// 结果: [2, 3]

drop([1, 2, 3], 2);
// 结果: [3]
```

## 参数

- `array (Array)`: 要查询的数组。
- `n (number)`: 要去除的元素个数。

## 返回值

- `(Array)`: 返回数组切片。

## 来源

- [es-toolkit drop](https://es-toolkit.dev/zh_hans/reference/array/drop.html)
