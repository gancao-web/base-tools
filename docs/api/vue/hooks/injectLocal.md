# injectLocal

## 描述

注入本地提供的状态。

## 示例

````ts
import { injectLocal, provideLocal } from '@base-web-kits/base-tools-vue';

// 在父组件中
provideLocal('key', 'value');

// 在子组件中
const value = injectLocal('key');
```来源

[VueUse](https://vueuse.org/functions/injectLocal/)
````
