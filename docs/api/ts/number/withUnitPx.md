# withUnitPx
给数字添加px单位 (支持数字字符串,其他非法字符返回原值)

## Example

```ts
import { withUnitPx } from '@base-web-kits/base-tools/ts';
withUnitPx(10) // "10px"
withUnitPx('10') // "10px"
withUnitPx('10px') // "10px"
withUnitPx("auto") // "auto"
withUnitPx("30%") // "30%"
withUnitPx(null | undefined | '') // ""
withUnitPx(0) // "0px"
```