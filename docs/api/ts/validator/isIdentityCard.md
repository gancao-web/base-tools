# isIdentityCard

身份证校验（支持中国大陆严格校验；台湾/香港/澳门做格式校验）。

## 示例

```ts
import { isIdentityCard } from '@base-web-kits/base-tools-ts';
isIdentityCard('11010519491231002X'); // true（大陆）
isIdentityCard('A123456789'); // true（台湾格式）
isIdentityCard('A123456(3)'); // true（香港格式）
isIdentityCard('1234567(8)'); // true（澳门格式）
```
