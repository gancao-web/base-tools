# formatFileSize

将字节数格式化为易读的文件体积，自动选择 B、KB、MB、GB、TB 或 PB。

## 示例

```ts
import { formatFileSize } from '@base-web-kits/base-tools-ts';

formatFileSize(1536); // '1.5KB'
formatFileSize(1_500_000, { base: 1000 }); // '1.5MB'
formatFileSize(undefined); // '-'
```

## 参数

- `bytes (number | undefined)`：字节数；负数和非有限数按无效输入处理。
- `options.base (1000 | 1024)`：换算进制，默认 `1024`。
- `options.decimals (number)`：最多保留的小数位，默认 `2`，末尾的 0 会被移除。
- `options.fallback (string)`：无效输入的返回值，默认 `'-'`。

## 版本

- 1.6.0 新增
