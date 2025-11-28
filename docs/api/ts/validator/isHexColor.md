# isHexColor
HEX 颜色值（支持 `#RGB`、`#RRGGBB`、`#RRGGBBAA`）。

## Example

```ts
import { isHexColor } from '@base-web-kits/base-tools/ts';
isHexColor('#fff') // true
isHexColor('#00ff00') // true
isHexColor('#11223344') // true
```