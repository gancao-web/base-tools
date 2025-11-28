# isTaxID
校验统一社会信用代码（中国税号常用：18 位，含校验位）。

## Example

```ts
import { isTaxID } from '@base-web-kits/base-tools/ts';
isTaxID('91350100M000100Y43') // true/false 取决于校验位
```