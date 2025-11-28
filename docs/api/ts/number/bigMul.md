# bigMul
高精度乘法（支持多个参数连乘）。

## Example

```ts
import { bigMul } from '@base-web-kits/base-tools/ts';
bigMul(0.1, 0.2); // => 0.02
bigMul('1.5', '3'); // => 4.5
bigMul(2, 3, 4); // => 24  // 多参数连乘: 2*3*4
```