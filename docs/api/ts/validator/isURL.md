# isURL
校验 URL（要求含协议，支持 http/https/ftp）。

## Example

```ts
import { isURL } from '@base-web-kits/base-tools/ts';
isURL('https://example.com/path?a=1') // true
isURL('example.com') // false（缺少协议）
```