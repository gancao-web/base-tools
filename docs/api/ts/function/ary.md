# ary

创建一个函数，调用 `func` 时最多接受 `n` 个参数。

## 示例

```ts
import { ary } from '@base-web-kits/base-tools-ts';

['6', '8', '10'].map(ary(parseInt, 1));
// 结果: [6, 8, 10]
```

## 参数

- `func (Function)`: 要处理的函数。
- `n (number)`: 限制的参数个数。

## 返回值

- `(Function)`: 返回新函数。

## 来源

- [es-toolkit ary](https://es-toolkit.dev/zh_hans/reference/function/ary.html)
