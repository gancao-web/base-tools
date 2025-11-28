# randomFloat
随机生成 `a` 到 `b` 的浮点数（半开区间，包含下界不包含上界）。

## Example

```ts
import { randomFloat } from '@base-web-kits/base-tools/ts';
randomFloat(0, 10); // => [0, 10) 内的随机浮点数
randomFloat(10, 0); // => [0, 10) 内的随机浮点数
randomFloat(5.2, 10.8); // => [5.2, 10.8) 内的随机浮点数
```