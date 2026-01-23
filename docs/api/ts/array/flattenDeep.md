# flattenDeep

将数组递归展平。

## 示例

```ts
import { flattenDeep } from '@base-web-kits/base-tools-ts';

flattenDeep([1, [2, [3, [4]], 5]]);
// 结果: [1, 2, 3, 4, 5]
```

## 参数

- `array (Array)`: 要展平的数组。

## 返回值

- `(Array)`: 返回新数组。

## 来源

- [es-toolkit flattenDeep](https://es-toolkit.dev/zh_hans/reference/array/flattenDeep.html)
