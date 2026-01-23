# curry

创建一个柯里化函数。

## 示例

```ts
import { curry } from '@base-web-kits/base-tools-ts';

const abc = function(a, b, c) {
  return [a, b, c];
};

const curried = curry(abc);

curried(1)(2)(3);
// 结果: [1, 2, 3]

curried(1, 2)(3);
// 结果: [1, 2, 3]
```

## 参数

- `func (Function)`: 要柯里化的函数。
- `arity (number)`: 需要的参数个数。

## 返回值

- `(Function)`: 返回柯里化后的函数。

## 来源

- [es-toolkit curry](https://es-toolkit.dev/zh_hans/reference/function/curry.html)
