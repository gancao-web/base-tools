# difference

创建一个具有唯一数组值的数组，每个值不包含在其他给定的数组中。

## 示例

```ts
import { difference } from '@base-web-kits/base-tools-ts';

difference([2, 1], [2, 3]);
// 结果: [1]
```

## 参数

- `array (Array)`: 要检查的数组。
- `values (Array)`: 排除的值。

## 返回值

- `(Array)`: 返回过滤后的新数组。

## 来源

- [es-toolkit difference](https://es-toolkit.dev/zh_hans/reference/array/difference.html)
