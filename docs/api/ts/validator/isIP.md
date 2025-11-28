# isIP
校验 IP（支持 IPv4 与 IPv6）。

## Example

```ts
import { isIP } from '@base-web-kits/base-tools/ts';
isIP('127.0.0.1') // true
isIP('::1') // true
isIP('127.0.0.1', 6) // false
```