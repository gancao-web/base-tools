# getUrlParam

获取url的查询参数值

- url必填,不会默认为当前路由

## 示例

```ts
import { getUrlParam } from '@base-web-kits/base-tools-ts';
const q = getUrlParam('q', 'https://a.com/?q=%E6%B5%8B%E8%AF%95'); // "测试"
const a = getUrlParam('a', 'a=1'); // "1"
const list = getUrlParam('list', 'list=[1,2]'); // "[1,2]"
const list = getUrlParam('list', 'list=null'); // null
const list = getUrlParam('list', 'list=undefined'); // null
```

## 版本

- 1.0.0 新增
