# getCountdownParts

获取倒计时的时间分解（零填充字符串）

- 输入：毫秒差值
- 输出：包含天、时、分、秒、毫秒的零填充对象
- 到期返回 { d: '00', h: '00', m: '00', s: '00', ms: '000' }

## 示例

```ts
import { getCountdownParts } from '@base-web-kits/base-tools-ts';
const diff = toDayjs(t).diff(); // 毫秒差值
const parts = getCountdownParts(diff); // { d: '00', h: '00', m: '00', s: '00', ms: '000' }
```
