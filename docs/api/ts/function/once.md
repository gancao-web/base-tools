# once

创建一个只能调用一次的函数。

## 示例

```ts
import { once } from '@base-web-kits/base-tools-ts';

const initialize = once(createApplication);
initialize();
initialize();
// `initialize` 只能被调用一次。
```

## 参数

- `func (Function)`: 只能调用一次的函数。

## 返回值

- `(Function)`: 返回新函数。

## 来源

- [es-toolkit once](https://es-toolkit.dev/zh_hans/reference/function/once.html)
