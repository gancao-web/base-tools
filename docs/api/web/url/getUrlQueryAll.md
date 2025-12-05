# getUrlQueryAll

获取 URL 的所有查询参数值

## 示例

```ts
import { getUrlQueryAll } from '@base-web-kits/base-tools-web';
// 默认当前地址
const params = getUrlQueryAll();
// 指定 URL
const params = getUrlQueryAll('https://a.com/?a=1&b=2'); // { a: "1", b: "2" }
// 仅查询串
const params = getUrlQueryAll('a=1&b=2'); // { a: "1", b: "2" }
```

## 参数

| 参数名 | 类型 | 描述 | 默认值 |
|--------|------|------|--------|
| url | string | 完整 URL 或仅查询串（如 "a=1&b=2"） | `window.location.href` |

## 返回值

| 类型 | 描述 |
|------|------|
| Record<string, string> | 解码后的键值对象（无参数返回空对象; "null"\|"undefined"的参数会被忽略） |

## 版本

- 1.0.0 新增
