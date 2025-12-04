# getUrlParamAll

获取url的所有查询参数值

## 示例

```ts
import { getUrlParamAll } from '@base-web-kits/base-tools-ts';
const params = getUrlParamAll('a=1&b=2'); // { a: "1", b: "2" }
const params = getUrlParamAll('https://a.com/?a=1&b=2'); // { a: "1", b: "2" }
const params = getUrlParamAll('a=1&b=null'); // { a: "1" }
const params = getUrlParamAll('a=1&b=undefined'); // { a: "1" }
```

## 版本

- 1.0.0 新增
