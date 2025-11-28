# withUnit
给数字添加指定单位 (支持数字字符串,其他非法字符返回原值)

## Example

```ts
import { withUnit } from '@base-web-kits/base-tools/ts';
withUnit(0, 'px') // "0px"
withUnit(1, 'px') // "1px"
withUnit('1', 'rpx') // "1rpx"
withUnit('1', '%') // "1%"
withUnit('auto', 'px') // "auto"
withUnit(null | undefined | '') // ""
```