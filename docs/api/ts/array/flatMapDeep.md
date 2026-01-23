# flatMapDeep

类似 `flatMap`，但是会递归扁平化。

## 示例

```ts
import { flatMapDeep } from '@base-web-kits/base-tools-ts';

function duplicate(n) {
  return [[[n, n]]];
}

flatMapDeep([1, 2], duplicate);
// 结果: [1, 1, 2, 2]
```

## 参数

- `array (Array)`: 要迭代的数组。
- `iteratee (Function)`: 每次迭代调用的函数。

## 返回值

- `(Array)`: 返回新数组。

## 来源

- [es-toolkit flatMapDeep](https://es-toolkit.dev/zh_hans/reference/array/flatMapDeep.html)
