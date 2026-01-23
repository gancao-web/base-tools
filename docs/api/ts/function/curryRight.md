# curryRight

类似 `curry`，但是参数是从右往左传递。

## 示例

```ts
import { curryRight } from '@base-web-kits/base-tools-ts';

const abc = function(a, b, c) {
  return [a, b, c];
};

const curried = curryRight(abc);

curried(3)(2)(1);
// 结果: [1, 2, 3]
```

## 参数

- `func (Function)`: 要柯里化的函数。
- `arity (number)`: 需要的参数个数。

## 返回值

- `(Function)`: 返回柯里化后的函数。

## 来源

- [es-toolkit curryRight](https://es-toolkit.dev/zh_hans/reference/function/curryRight.html)
