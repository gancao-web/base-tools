# without

创建一个排除所有给定值的数组。

## 示例

```ts
import { without } from '@base-web-kits/base-tools-ts';

without([2, 1, 2, 3], 1, 2);
// 结果: [3]
```

## 参数

- `array (Array)`: 要检查的数组。
- `values (...any)`: 要排除的值。

## 返回值

- `(Array)`: 过滤后的新数组。

## 来源

- [es-toolkit without](https://es-toolkit.dev/zh_hans/reference/array/without.html)
