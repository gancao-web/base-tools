# randomInt
随机生成 `a` 到 `b` 的整数（闭区间，包含两端）。

## Example

```ts
import { randomInt } from '@base-web-kits/base-tools/ts';
randomInt(0, 10); // => 0..10 之间的随机整数（含 0 与 10）
randomInt(10, 0); // => 0..10 之间的随机整数（含 0 与 10）
randomInt(5.2, 10.8); // => 6..10 之间取整随机数（含 6 与 10）
```