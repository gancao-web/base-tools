# bigTimes

高精度乘法（支持多个参数连乘）。

## 示例

```ts
import { bigTimes } from '@base-web-kits/base-tools-ts';
bigTimes(0.1, 0.2); // => 0.02
bigTimes('1.5', '3'); // => 4.5
bigTimes(2, 3, 4); // => 24  // 多参数连乘: 2*3*4
```
