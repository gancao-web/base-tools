# bigDiv

高精度除法（支持多个参数连除）。

## 示例

```ts
import { bigDiv } from '@base-web-kits/base-tools-ts';
bigDiv(1, 3); // => 0.333333...
bigDiv('10', '4'); // => 2.5
bigDiv(100, 5, 2); // => 10  // 多参数连除: 100/5/2
```

## 版本

- 1.0.0 新增
