# before

创建一个函数，调用次数不超过 `n` 次。之后再调用将返回最后一次调用的结果。

## 示例

```ts
import { before } from '@base-web-kits/base-tools-ts';

let count = 0;
const limited = before(3, () => ++count);

limited(); // 1
limited(); // 2
limited(); // 2
```

## 参数

- `n (number)`: 限制调用次数。
- `func (Function)`: 要限制的函数。

## 返回值

- `(Function)`: 返回新函数。

## 来源

- [es-toolkit before](https://es-toolkit.dev/zh_hans/reference/function/before.html)
