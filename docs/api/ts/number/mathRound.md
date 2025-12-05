# mathRound

四舍五入到指定小数位数

## 示例

```ts
import { mathRound } from '@base-web-kits/base-tools-ts';
mathRound(1.6); // => 2
mathRound('1.234', 2); // => 1.23
mathRound('1.235', 2); // => 1.24
mathRound('1.299', 2, BigNumber.ROUND_DOWN); // => 1.29
```

## 版本

- 1.0.0 新增
