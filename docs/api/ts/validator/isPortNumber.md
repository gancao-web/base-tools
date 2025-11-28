# isPortNumber
端口号校验（0 ~ 65535，整数）。

## Example

```ts
import { isPortNumber } from '@base-web-kits/base-tools/ts';
isPortNumber(80) // true
isPortNumber('65535') // true
isPortNumber(70000) // false
```