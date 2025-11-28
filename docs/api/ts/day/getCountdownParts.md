# getCountdownParts
获取倒计时的时间分解（零填充字符串）

## Example

```ts
import { getCountdownParts } from '@base-web-kits/base-tools/ts';
const diff = toDayjs(t).diff(); // 毫秒差值
const parts = getCountdownParts(diff); // { d: '01', h: '02', m: '03', s: '04', ms: '567' }
```