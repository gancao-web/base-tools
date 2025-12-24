# JsonValue

定义可序列化为 JSON 的数据类型。

包含：

- `JsonPrimitive`: `string | number | boolean | null`
- `JsonObject`: `{ [k: string]: JsonValue }`
- `JsonArray`: `Array<JsonValue>`
- `JsonValue`: `JsonPrimitive | JsonObject | JsonArray`

## 示例

```ts
import { JsonValue, JsonObject, JsonArray } from '@base-web-kits/base-tools-ts';

const data: JsonValue = {
  a: 1,
  b: 'string',
  c: true,
  d: null,
  e: [1, 2, 3],
  f: { g: 4 },
};
```

## 版本

- 1.0.0 新增
