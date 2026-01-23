# negate

创建一个结果取反的函数。

## 示例

```ts
import { negate } from '@base-web-kits/base-tools-ts';

function isEven(n) {
  return n % 2 == 0;
}

const isOdd = negate(isEven);
isOdd(1);
// 结果: true
```

## 参数

- `predicate (Function)`: 要取反的函数。

## 返回值

- `(Function)`: 返回新函数。

## 来源

- [es-toolkit negate](https://es-toolkit.dev/zh_hans/reference/function/negate.html)
