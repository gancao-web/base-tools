# inRange

检查 `number` 是否在 `start` 和 `end` 之间（包括 `start`，不包括 `end`）。

## 示例

```ts
import { inRange } from '@base-web-kits/base-tools-ts';

inRange(3, 2, 4);
// 结果: true

inRange(4, 8);
// 结果: true (默认 start 为 0)
```

## 参数

- `number (number)`: 要检查的数字。
- `start (number)`: 开始范围。
- `end (number)`: 结束范围。

## 返回值

- `(boolean)`: 如果在范围内返回 `true`，否则返回 `false`。

## 来源

- [es-toolkit inRange](https://es-toolkit.dev/zh_hans/reference/math/inRange.html)
