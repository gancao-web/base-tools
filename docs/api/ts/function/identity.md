# identity

这个函数返回接收到的第一个参数。

## 示例

```ts
import { identity } from '@base-web-kits/base-tools-ts';

const object = { a: 1 };
console.log(identity(object) === object);
// 结果: true
```

## 参数

- `value (any)`: 任何值。

## 返回值

- `(any)`: 返回 `value`。

## 来源

- [es-toolkit identity](https://es-toolkit.dev/zh_hans/reference/function/identity.html)
