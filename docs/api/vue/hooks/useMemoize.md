# useMemoize

## 描述

缓存函数的结果。

## 示例

```ts
import { useMemoize } from '@base-web-kits/base-tools-vue';

const getUser = useMemoize(async (userId: number) => {
  return await fetch(`https://api.github.com/users/${userId}`).then((r) => r.json());
});

const user1 = await getUser(1); // request
const user2 = await getUser(1); // cached
```

## 来源

[VueUse](https://vueuse.org/functions/useMemoize/)
