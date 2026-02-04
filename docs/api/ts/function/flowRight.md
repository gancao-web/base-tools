# flowRight

类似 `flow`，但是函数调用顺序是从右往左（Compose）。

## 示例

```ts
import { flowRight } from '@base-web-kits/base-tools-ts';

function add(x) {
  return x + 1;
}
function square(x) {
  return x * x;
}

const addSquare = flowRight([square, add]);
addSquare(2);
// 结果: 9
```

## 参数

- `funcs (Array)`: 要调用的函数数组。

## 返回值

- `(Function)`: 返回新函数。

## 来源

- [es-toolkit flowRight](https://es-toolkit.dev/zh_hans/reference/function/flowRight.html)
