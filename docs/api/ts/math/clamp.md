# clamp

将数字限制在包含的下限和上限范围内。

## 示例

```ts
import { clamp } from '@base-web-kits/base-tools-ts';

clamp(-10, -5, 5);
// 结果: -5

clamp(10, -5, 5);
// 结果: 5
```

## 参数

- `number (number)`: 要限制的数字。
- `lower (number)`: 下限。
- `upper (number)`: 上限。

## 返回值

- `(number)`: 返回限制后的数字。

## 来源

- [es-toolkit clamp](https://es-toolkit.dev/zh_hans/reference/math/clamp.html)
