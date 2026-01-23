# unary

创建一个函数，最多接受一个参数。

## 示例

```ts
import { unary } from '@base-web-kits/base-tools-ts';

['6', '8', '10'].map(unary(parseInt));
// 结果: [6, 8, 10]
```

## 参数

- `func (Function)`: 要处理的函数。

## 返回值

- `(Function)`: 返回新函数。

## 来源

- [es-toolkit unary](https://es-toolkit.dev/zh_hans/reference/function/unary.html)
