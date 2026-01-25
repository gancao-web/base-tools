# provideLocal

## 描述
提供本地状态。

## 示例

```ts
import { provideLocal, injectLocal } from '@base-web-kits/base-tools-vue';

// 在父组件中
provideLocal('key', 'value');

// 在子组件中
const value = injectLocal('key');
```来源

[VueUse](https://vueuse.org/functions/provideLocal/)
