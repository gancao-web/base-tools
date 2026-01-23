# trimStart

从字符串开头删除空白字符或指定字符。

## 示例

```ts
import { trimStart } from '@base-web-kits/base-tools-ts';

trimStart('  abc  ');
// 结果: 'abc  '

trimStart('-_-abc-_-', '_-');
// 结果: 'abc-_-'
```

## 参数

- `string (string)`: 要处理的字符串。
- `chars (string)`: 要删除的字符。

## 返回值

- `(string)`: 返回处理后的字符串。

## 来源

- [es-toolkit trimStart](https://es-toolkit.dev/zh_hans/reference/string/trimStart.html)
