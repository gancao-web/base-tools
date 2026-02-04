# flow

创建一个函数，返回调用所有函数后的结果，每个函数的返回值作为下一个函数的参数。

## 示例

```ts
import { flow } from '@base-web-kits/base-tools-ts';

function add(x) {
  return x + 1;
}
function square(x) {
  return x * x;
}

const addSquare = flow([add, square]);
addSquare(2);
// 结果: 9
```

## 参数

- `funcs (Array)`: 要调用的函数数组。

## 返回值

- `(Function)`: 返回新函数。

## 来源

- [es-toolkit flow](https://es-toolkit.dev/zh_hans/reference/function/flow.html)
