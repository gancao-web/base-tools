# isNumeric
数字字符串格式校验

## Example

```ts
import { isNumeric } from '@base-web-kits/base-tools/ts';
isNumeric('123.45'); // true
isNumeric('123.45', { decimal: 0 }); // false
isNumeric('-1,234.5', { negative: true, thousands: true }); // true
isNumeric('0123', { leadZero: true }); // true（现在允许）
isNumeric('0123'); // false（默认禁止）
isNumeric('0.50'); // true（始终允许）
isNumeric('.5'); // false（整数部分不能省）
isNumeric('123.'); // false（小数部分不能省）
```