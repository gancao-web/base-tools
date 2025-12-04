# isJSON

判断字符串是否为合法 JSON 文本。

## 示例

```ts
import { isJSON } from '@base-web-kits/base-tools-ts';
isJSON('{"a":1}'); // true
isJSON('[1,2]'); // true
isJSON('abc'); // false
```

## 版本

- 1.0.0 新增
