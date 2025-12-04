# isPassport

护照号码校验（宽松通用格式，适合单输入框无法确认国家的场景）。

## 示例

```ts
import { isPassport } from '@base-web-kits/base-tools-ts';
isPassport('E12345678'); // true
isPassport('P1234567'); // true
isPassport('A12345678'); // true（台湾常见）
isPassport('AB-1234567'); // true（移除分隔符后匹配）
```

## 版本

- 1.0.0 新增
