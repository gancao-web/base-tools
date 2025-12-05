# getUrlQuery

获取 URL 的查询参数值

## 示例

```ts
import { getUrlQuery } from '@base-web-kits/base-tools-web';
// 默认当前地址
const q = getUrlQuery('q');
// 指定 URL
const q = getUrlQuery('q', 'https://a.com/?q=%E6%B5%8B%E8%AF%95'); // "测试"
// 仅查询串
const a = getUrlQuery('a', 'a=1'); // "1"
```

## 参数

| 参数名 | 类型 | 描述 | 默认值 |
|--------|------|------|--------|
| key | string | 参数名 | - |
| url | string | 完整 URL 或仅查询串（如 "a=1&b=2"） | `window.location.href` |

## 返回值

| 类型 | 描述 |
|------|------|
| string \| null | 解码后的参数值 (若不存在\|"null"\|"undefined"，则返回 null) |

## 版本

- 1.0.0 新增
