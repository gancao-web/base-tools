# getUrlNumber

获取url的查询参数值,并转为number类型

## 示例

```ts
import { getUrlNumber } from '@base-web-kits/base-tools-ts';
const a = getUrlNumber('a', 'https://a.com/?a=1'); // 1
const a = getUrlNumber('a', 'a=1'); // 1
const a = getUrlNumber('a', 'a=1.2'); // 1.2
const a = getUrlNumber('a', 'a=abc'); // null
```

## 版本

- 1.0.0 新增
