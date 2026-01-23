# unescape

反转义字符串中的 HTML 实体。

## 示例

```ts
import { unescape } from '@base-web-kits/base-tools-ts';

unescape('fred, barney, &amp; pebbles');
// 结果: 'fred, barney, & pebbles'
```

## 参数

- `string (string)`: 要反转义的字符串。

## 返回值

- `(string)`: 返回反转义后的字符串。

## 来源

- [es-toolkit unescape](https://es-toolkit.dev/zh_hans/reference/string/unescape.html)
