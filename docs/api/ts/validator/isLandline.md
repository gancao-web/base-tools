# isLandline
是否为中国大陆座机号（区号-号码，可选分机）。

## Example

```ts
import { isLandline } from '@base-web-kits/base-tools/ts';
isLandline('010-88888888') // true
isLandline('0371-12345678-123') // true
```