# toMaskText

文本脱敏

## 示例

```ts
import { toMaskText } from '@base-web-kits/base-tools-ts';
toMaskText('王小明', 1, 0); // => '王*'
toMaskText('王小明', 1, 1); // => '王*明'
toMaskText('13800138000', 3, 4); // => '138****8000'
```
