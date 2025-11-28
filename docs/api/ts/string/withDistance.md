# withDistance
给数字添加距离单位：当数值大于等于 1000m 时转换为 km，否则显示 m（最多两位小数、无无意义补零）

## Example

```ts
import { withDistance } from '@base-web-kits/base-tools/ts';
withDistance(5); // => '5m'
withDistance(999.456); // => '999.46m'
withDistance(1000); // => '1km'
withDistance('1500'); // => '1.5km'
withDistance('1728'); // => '1.73km'
```