# trim

从字符串两端删除空白字符或指定字符。

## 示例

```ts
import { trim } from '@base-web-kits/base-tools-ts';

trim('  abc  ');
// 结果: 'abc'

trim('-_-abc-_-', '_-');
// 结果: 'abc'
```

## 参数

- `string (string)`: 要处理的字符串。
- `chars (string)`: 要删除的字符。

## 返回值

- `(string)`: 返回处理后的字符串。

## 来源

- [es-toolkit trim](https://es-toolkit.dev/zh_hans/reference/string/trim.html)
