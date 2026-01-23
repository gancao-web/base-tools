# flatMap

创建一个新数组，其中包含对 `array` 每个元素调用 `iteratee` 的结果，并且结果是扁平化的（一层）。

## 示例

```ts
import { flatMap } from '@base-web-kits/base-tools-ts';

function duplicate(n) {
  return [n, n];
}

flatMap([1, 2], duplicate);
// 结果: [1, 1, 2, 2]
```

## 参数

- `array (Array)`: 要迭代的数组。
- `iteratee (Function)`: 每次迭代调用的函数。

## 返回值

- `(Array)`: 返回新数组。

## 来源

- [es-toolkit flatMap](https://es-toolkit.dev/zh_hans/reference/array/flatMap.html)
