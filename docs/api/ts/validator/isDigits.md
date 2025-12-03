# isDigits

纯数字（非负整数,不含空格与符号）。

## 示例

```ts
import { isDigits } from '@base-web-kits/base-tools-ts';
isDigits('12'); // true
isDigits('1.2'); // false
isDigits('-12'); // false
isDigits('a12'); // false
```
