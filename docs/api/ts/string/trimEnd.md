# trimEnd

从字符串末尾删除空白字符或指定字符。

## 示例

```ts
import { trimEnd } from '@base-web-kits/base-tools-ts';

trimEnd('  abc  ');
// 结果: '  abc'

trimEnd('-_-abc-_-', '_-');
// 结果: '-_-abc'
```

## 参数

- `string (string)`: 要处理的字符串。
- `chars (string)`: 要删除的字符。

## 返回值

- `(string)`: 返回处理后的字符串。

## 来源

- [es-toolkit trimEnd](https://es-toolkit.dev/zh_hans/reference/string/trimEnd.html)
