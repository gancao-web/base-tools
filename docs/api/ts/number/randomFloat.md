# randomFloat

随机生成 `a` 到 `b` 的浮点数（半开区间，包含下界不包含上界）。

- 自动交换边界，按从小到大处理。

## 示例

```ts
import { randomFloat } from '@base-web-kits/base-tools-ts';

const float1 = randomFloat(0, 10); // => [0, 10) 内的随机浮点数
const float2 = randomFloat(10, 0); // => [0, 10) 内的随机浮点数
const float3 = randomFloat(5.2, 10.8); // => [5.2, 10.8) 内的随机浮点数
console.log(float1, float2, float3);
```
