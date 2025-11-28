# toast
提示

## Example

```ts
import { toast } from '@base-web-kits/base-tools/uni';
await toast('保存成功');
back(); // 小程序的toast是页面级的,而非全局;若toast不await,直接back,则toast会看不见
```