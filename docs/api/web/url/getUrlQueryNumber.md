# getUrlQueryNumber

获取 URL 的查询参数值，并转为 number 类型

## 示例

```ts
import { getUrlQueryNumber } from '@base-web-kits/base-tools-web';
// 默认当前地址
const a = getUrlQueryNumber('a');
// 指定 URL
const a = getUrlQueryNumber('a', 'https://a.com/?a=1'); // 1
// 仅查询串
const a = getUrlQueryNumber('a', 'a=1.2'); // 1.2
```

## 参数

| 参数名 | 类型 | 描述 | 默认值 |
|--------|------|------|--------|
| key | string | 参数名 | - |
| url | string | 完整 URL 或仅查询串（如 "a=1&b=2"） | `window.location.href` |

## 返回值

| 类型 | 描述 |
|------|------|
| number \| null | 解码后的参数值 (若不存在\|"非数字字符串"，则返回 null) |

## 版本

- 1.0.0 新增
