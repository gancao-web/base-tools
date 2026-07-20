# joinUrlPath

拼接 URL 路径，并清理各部分交界处多余的斜杠。

空字符串、`null` 和 `undefined` 会被忽略。协议中的 `://` 以及第一个有效参数开头的 `/` 会被保留。

该函数只负责拼接路径，不负责解析或合并查询参数和哈希片段。

## 示例

```ts
import { joinUrlPath } from '@base-web-kits/base-tools-ts';

joinUrlPath('https://a.com/', '/images/', '/avatar.png');
// 'https://a.com/images/avatar.png'

joinUrlPath('https://a.com/', '', null, undefined, '/avatar.png');
// 'https://a.com/avatar.png'

joinUrlPath('', '/images/', 'avatar.png');
// '/images/avatar.png'

joinUrlPath('', null, undefined);
// ''
```

## 参数

| 参数       | 类型                                 | 说明                         |
| ---------- | ------------------------------------ | ---------------------------- |
| `...parts` | `Array<string \| null \| undefined>` | URL 或路径片段；空值会被忽略 |

## 返回值

返回拼接后的 URL 路径。没有有效片段时返回空字符串。

## 版本

- 1.4.9 新增
