# toMaskPhone

手机号中间打星：保留前三位与后四位，中间打 `*`。

## 示例

```ts
import { toMaskPhone } from '@base-web-kits/base-tools-ts';
toMaskPhone('13800138000'); // => '138****8000'
```

## 版本

- 1.0.0 新增
