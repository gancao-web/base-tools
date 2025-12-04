# withUnitRpx

给数字添加rpx单位 (支持数字字符串,其他非法字符返回原值)

## 示例

```ts
import { withUnitRpx } from '@base-web-kits/base-tools-uni';
withUnitRpx(10); // "10rpx"
withUnitRpx('10'); // "10rpx"
withUnitRpx('10px'); // "10px"
withUnitRpx('auto'); // "auto"
withUnitRpx('30%'); // "30%"
withUnitRpx(null | undefined | ''); // ""
withUnitRpx(0); // "0rpx"
```

## 版本

- 1.0.0 新增
