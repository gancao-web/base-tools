# getCountdownParts

获取倒计时的时间分解（零填充字符串）

- 输入：毫秒差值
- 输出：格式为 `{ d: '00', h: '00', m: '00', s: '00', ms: '000' }`

## 示例

```ts
import { getCountdownParts } from '@base-web-kits/base-tools-ts';
const parts = getCountdownParts(10000);
// parts 格式为 { d: '00', h: '00', m: '00', s: '00', ms: '000' }
```

## 版本

- 1.0.0 新增
