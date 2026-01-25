# StorageSerializers

## 描述

存储序列化器。

## 示例

```ts
import { StorageSerializers, useStorage } from '@base-web-kits/base-tools-vue';

const state = useStorage('key', { hello: 'hi' }, localStorage, {
  serializer: StorageSerializers.object,
});
``` 示例代码
```

## 来源

[VueUse](https://vueuse.org/functions/StorageSerializers/)
