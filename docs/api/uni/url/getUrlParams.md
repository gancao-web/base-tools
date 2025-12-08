# getUrlParams

获取url的所有查询参数值

- url必填,不会默认为当前路由

## 示例

```ts
import { getUrlParams } from '@base-web-kits/base-tools-ts';
const params = getUrlParams('a=1&b=2'); // { a: "1", b: "2" }
const params = getUrlParams('https://a.com/?a=1&b=2'); // { a: "1", b: "2" }
const params = getUrlParams('a=1&b=null'); // { a: "1" }
const params = getUrlParams('a=1&b=undefined'); // { a: "1" }
```

## 版本

- 1.0.0 新增
