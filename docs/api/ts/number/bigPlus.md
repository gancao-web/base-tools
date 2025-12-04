# bigPlus

高精度加法（支持多个参数连加）。

## 示例

```ts
import { bigPlus } from '@base-web-kits/base-tools-ts';
bigPlus(0.1, 0.2); // => 0.3
bigPlus('0.1', '0.2'); // => 0.3
bigPlus(1, 2, 3, 4); // => 10  // 多参数连加: 1+2+3+4
```

## 版本

- 1.0.0 新增
