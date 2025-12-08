# mathTimes

高精度乘法（支持多个参数连乘）。

## 示例

```ts
import { mathTimes } from '@base-web-kits/base-tools-ts';
mathTimes(0.1, 0.2); // => 0.02
mathTimes('1.5', '3'); // => 4.5
mathTimes(2, 3, 4); // => 24  // 多参数连乘: 2*3*4
```

## 版本

- 1.0.0 新增
