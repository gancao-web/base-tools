# partialRight

类似 `partial`，但是参数预设是从右往左。

## 示例

```ts
import { partialRight } from '@base-web-kits/base-tools-ts';

function greet(greeting, name) {
  return greeting + ' ' + name;
}

const greetFred = partialRight(greet, 'fred');
greetFred('hi');
// 结果: 'hi fred'
```

## 参数

- `func (Function)`: 要处理的函数。
- `partials (...any)`: 预设的参数。

## 返回值

- `(Function)`: 返回新函数。

## 来源

- [es-toolkit partialRight](https://es-toolkit.dev/zh_hans/reference/function/partialRight.html)
