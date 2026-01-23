# pad

如果在左右两侧填充字符，如果字符串长度短于 `length`。

## 示例

```ts
import { pad } from '@base-web-kits/base-tools-ts';

pad('abc', 8);
// 结果: '  abc   '

pad('abc', 8, '_-');
// 结果: '_-abc_-_'
```

## 参数

- `string (string)`: 要填充的字符串。
- `length (number)`: 填充后的长度。
- `chars (string)`: 填充字符。

## 返回值

- `(string)`: 返回填充后的字符串。

## 来源

- [es-toolkit pad](https://es-toolkit.dev/zh_hans/reference/string/pad.html)
