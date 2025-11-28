# getIconBg
拼接完整的图标背景: `url(${hostIcon + icon})`

## Example

```ts
import { getIconBg } from '@base-web-kits/base-tools/uni';
:style="{'background-image': getIconBg('xx')}"
```