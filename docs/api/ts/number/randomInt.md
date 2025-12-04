# randomInt

随机生成 `a` 到 `b` 的整数（闭区间，包含两端）。

- 自动交换边界，按从小到大处理。
- 下界向上取整、上界向下取整后再取值。

## 示例

```ts
import { randomInt } from '@base-web-kits/base-tools-ts';

const num1 = randomInt(0, 10); // => 0..10 之间的随机整数（含 0 与 10）
const num2 = randomInt(10, 0); // => 0..10 之间的随机整数（含 0 与 10）
const num3 = randomInt(5.2, 10.8); // => 6..10 之间取整随机数（含 6 与 10）
console.log(num1, num2, num3);
```

## 版本

- 1.0.0 新增
