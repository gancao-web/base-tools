# partial

创建一个预设了部分参数的函数。

## 示例

```ts
import { partial } from '@base-web-kits/base-tools-ts';

function greet(greeting, name) {
  return greeting + ' ' + name;
}

const sayHello = partial(greet, 'hello');
sayHello('fred');
// 结果: 'hello fred'
```

## 参数

- `func (Function)`: 要处理的函数。
- `partials (...any)`: 预设的参数。

## 返回值

- `(Function)`: 返回新函数。

## 来源

- [es-toolkit partial](https://es-toolkit.dev/zh_hans/reference/function/partial.html)
