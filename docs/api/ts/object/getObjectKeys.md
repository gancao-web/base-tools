# getObjectKeys

获取对象键名数组（类型安全）。

- 内置 `Object.keys` 与 `lodash-es` 的 `keys` 在 TS 中通常返回 `string[]`，无法精确到 `keyof T`。

## 示例

```ts
import { getObjectKeys } from '@base-web-kits/base-tools-ts';

const o = { a: 1, b: 'x' };
const keys = getObjectKeys(o); // type: ('a' | 'b')[], value: ['a','b']
```

## 版本

- 1.0.0 新增
