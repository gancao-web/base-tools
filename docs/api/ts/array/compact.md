# compact

创建一个新数组，包含原数组中所有的非假值元素。

## 示例

```ts
import { compact } from '@base-web-kits/base-tools-ts';

compact([0, 1, false, 2, '', 3]);
// 结果: [1, 2, 3]
```

## 参数

- `array (Array)`: 要检查的数组。

## 返回值

- `(Array)`: 返回过滤后的新数组。

## 来源

- [es-toolkit compact](https://es-toolkit.dev/zh_hans/reference/array/compact.html)
