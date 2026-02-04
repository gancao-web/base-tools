# createEventHook

## 描述

创建事件钩子。

## 示例

````ts
import { createEventHook } from '@base-web-kits/base-tools-vue';

const hook = createEventHook<string>();
hook.on((val) => console.log(val));
hook.trigger('hello');
``` 示例代码
````

## 来源

[VueUse](https://vueuse.org/functions/createEventHook/)
