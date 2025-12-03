# toChineseCurrency

金额转中文大写（支持角/分/厘，精度控制）。

## 示例

```ts
import { toChineseCurrency } from '@base-web-kits/base-tools-ts';
toChineseCurrency(0); // '零元整'
toChineseCurrency(10); // '拾元整'
toChineseCurrency(101); // '壹佰零壹元整'
toChineseCurrency(1001000); // '壹佰万零壹仟元整'
toChineseCurrency(1001.01); // '壹仟零壹元壹分'
toChineseCurrency('1234.5679', { precision: 3 }); // '壹仟贰佰叁拾肆元伍角陆分捌厘'
toChineseCurrency(-1.2); // '负壹元贰角'
```
