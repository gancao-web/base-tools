# toFixed

将数值按指定位数格式化为字符串（保留小数位）。

## 示例

```ts
import { toFixed } from '@base-web-kits/base-tools-ts';
toFixed('1'); // => '1.00'
+toFixed('1'); // => 1
toFixed(1.2345); // => '1.23'
toFixed(1.2345, 3); // => '1.235'
toFixed('1.2345', 0, BigNumber.ROUND_UP); // => '2'
```
