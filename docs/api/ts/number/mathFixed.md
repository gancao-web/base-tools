# mathFixed

将数值按指定位数格式化为字符串（保留小数位）。

## 示例

```ts
import { mathFixed } from '@base-web-kits/base-tools-ts';
mathFixed('1'); // => '1.00'
+mathFixed('1'); // => 1
mathFixed(1.2345); // => '1.23'
mathFixed(1.2345, 3); // => '1.235'
mathFixed('1.2345', 0, BigNumber.ROUND_UP); // => '2'
```

## 版本

- 1.0.0 新增
