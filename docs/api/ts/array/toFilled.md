# toFilled

创建一个新数组，其中指定索引处的元素被替换为 `value`。

## 示例

```ts
import { toFilled } from '@base-web-kits/base-tools-ts';

const array = [1, 2, 3];
toFilled(array, 1, 4);
// 结果: [1, 4, 3]
```

## 参数

- `array (Array)`: 要查询的数组。
- `index (number)`: 要替换的索引。
- `value (any)`: 替换的值。

## 返回值

- `(Array)`: 返回新数组。

## 来源

- [es-toolkit toFilled](https://es-toolkit.dev/zh_hans/reference/array/toFilled.html)
